import { BLACK, Board, WHITE } from "./Board.js";

/**
 * Represents a game of chess.
 */
export class Game {
  static computerMode = true;
  static lastCapture = 0;
  undoManager = [];
  capturedPieces = [];

  /**
   * Constructs new instance of Game.
   */
  constructor() {
    this.board = new Board();
    this.setupEventListeners();
    this.turnCount = 0;
    this.turn = WHITE;
    Game.lastCapture = 0;
  }

  /**
   * Prints all aspects of the game to the screen.
   */
  print() {
    this.board.print();

    // basis stats
    document.getElementById("to-move").textContent =
      this.turn[0].toUpperCase() + this.turn.substring(1);
    document.getElementById("turn-count").textContent = this.turnCount;
    document.getElementById("turns-since-capture").textContent =
      Game.lastCapture;

    // captured pieces
    let whiteContainer = document.getElementById("white-captured-pieces");
    let blackContainer = document.getElementById("black-captured-pieces");

    let whitePieces = this.capturedPieces.filter((f) => f.includes("white"));
    let blackPieces = this.capturedPieces.filter((f) => f.includes("black"));

    if (whitePieces.length > 0) {
      whiteContainer.innerHTML = "";
      whitePieces.forEach((f) => {
        whiteContainer.innerHTML += `<img draggable="false" src="${f}">`;
      });
    } else {
      whiteContainer.innerHTML = `<img draggable="false" src="./assets/white-pawn.svg">`;
      whiteContainer.querySelector("img").classList.add("invisible");
    }

    if (blackPieces.length > 0) {
      blackContainer.innerHTML = "";
      blackPieces.forEach((f) => {
        blackContainer.innerHTML += `<img draggable="false" src="${f}">`;
      });
    } else {
      blackContainer.innerHTML =
        '<img draggable="false" src="./assets/black-pawn.svg">';
      blackContainer.querySelector("img").classList.add("invisible");
    }
  }

  /**
   * Clears existing and adds new event listeners at start of game.
   * @returns {void}
   */
  setupEventListeners() {
    // for drag-and-drop
    document.querySelectorAll(".chessboard .row .cell").forEach((img) => {
      let newImg = img.cloneNode(true);
      img.parentNode.replaceChild(newImg, img);

      newImg.addEventListener("drop", this.dropPiece);
      newImg.addEventListener("dragover", this.dragOverSpace);
      newImg.addEventListener("dragleave", this.dragLeaveSpace);
      newImg.addEventListener("dragstart", this.dragPieceStart);
    });

    // for game mode
    document
      .querySelector("#mode-toggle")
      .addEventListener("click", this.changeGameMode.bind(this));
  }

  /**
   * Toggle computer mode.
   */
  static toggleComputerMode() {
    Game.computerMode = !Game.computerMode;
  }

  /**
   * Toggles the game mode between computer and friend mode.
   *
   * @param {Event} e - The event object triggered by the mode change.
   */
  changeGameMode(e) {
    Game.toggleComputerMode();

    // Toggle background colors
    document.getElementById("mode-toggle").classList.toggle("bg-indigo-600");
    document.getElementById("mode-toggle").classList.toggle("bg-gray-200");

    // Toggle translation effect
    document
      .getElementById("mode-toggle-span")
      .classList.toggle("translate-x-5");
    document
      .getElementById("mode-toggle-span")
      .classList.toggle("translate-x-0");

    // Update mode description based on the current game mode
    if (Game.computerMode) {
      document.getElementById("mode-description").textContent =
        "Disable to play with a friend.";
    } else {
      document.getElementById("mode-description").textContent =
        "Enable to play against a computer opponent.";
    }
  }

  /**
   * Prevents default behavior when a chess piece is dragged over.
   * Runs when a chess piece is dragged over e.target
   * @param {Event} e
   * @returns {void}
   */
  dragOverSpace(e) {
    e.preventDefault();
    // e.target.closest(".cell").classList.add(""); TODO: Add a class here to style spaces when hovered over
  }

  /**
   * Prevents default behavior when a dragged chess piece leaves a space on the chessboard.
   * Runs when a dragged chess piece leaves a space on the chessboard.
   * @param {Event} e
   * @returns {void}
   */
  dragLeaveSpace(e) {
    e.preventDefault();
    // e.target.closest(".cell").remove.add(""); TODO: Remove a class here to style spaces when hovered over
  }

  /**
   * Associates the id of the origin cell with the dragged element.
   * Runs when an element is first dragged
   * @param {Event} e
   * @returns {void}
   */
  dragPieceStart(e) {
    e.dataTransfer.setData("text", e.target.closest(".cell").id);
    e.dataTransfer.effectAllowed = "move";
  }

  /**
   * Initiates a new move on the board.
   * Runs when a chess piece is dropped on e.target cell.
   * @param {Event} e
   * @returns {void}
   */
  dropPiece = (e) => {
    // weird syntax so that this references the Game instance
    e.preventDefault();
    let originId = e.dataTransfer.getData("text");
    let destId = e.target.closest(".cell").id;

    if (this.board.isValidMove(this.turn, originId, destId)) {
      // make the move and save the undo function
      let undoFunction = this.board.move(originId, destId, this.capturedPieces);
      this.undoManager.push(undoFunction);
      this.turnCount++;
      this.turn = this.turn == WHITE ? BLACK : WHITE;
      this.print();
    }
  };

  /**
   * Undoes the last move made in the game.
   * It calls the undo function stored in the undo manager,
   * decrements the turn count, updates the current turn color,
   * and prints the current state of the game.
   * @returns {void}
   */
  undo() {
    let undoFunction = this.undoManager.pop();
    undoFunction();
    this.turnCount--;
    this.turn = this.turn == WHITE ? BLACK : WHITE;
    this.print();
  }
}
