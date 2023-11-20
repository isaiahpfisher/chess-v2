import { BLACK, Board, WHITE } from "./Board.js";

/**
 * Represents a game of chess.
 */
export class Game {
  static computerMode = true;

  /**
   * Constructs new instance of Game.
   */
  constructor() {
    this.board = new Board();
    this.setupEventListeners();
    this.turnCount = 0;
    this.turn = WHITE;
  }

  /**
   * Prints all aspects of the game to the screen.
   */
  print() {
    this.board.print();
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
      .addEventListener("click", this.changeGameMode);
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
    if (this.computerMode) {
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

    if (this.board.isValidMove(turn, originId, destId)) {
      // make the move
      this.board.move(originId, destId);
      this.turnCount++;
      this.turn = this.turn == WHITE ? BLACK : WHITE;
    }
  };
}
