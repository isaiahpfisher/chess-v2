import { BLACK, Board, EMPTY, WHITE } from "./Board.js";

/**
 * Represents a game of chess.
 */
export class Game {
  static computerMode = true;
  static lastCapture = 0;
  static invalidMessage = "";
  static moveHistory = [];
  undoManager = [];
  capturedPieces = [];
  moveHistory = [];
  boardHistory = [];

  /**
   * Constructs new instance of Game.
   */
  constructor() {
    this.board = new Board();
    this.setupEventListeners();
    this.turnCount = 0;
    this.turn = WHITE;
    this.gameOver = false;
    Game.lastCapture = 0;
    Game.invalidMessage = "";
    Game.moveHistory = [];
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

    let whitePieces = this.capturedPieces.filter((f) => f.includes(WHITE));
    let blackPieces = this.capturedPieces.filter((f) => f.includes(BLACK));

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

    // move history
    let moveContainer = document.getElementById("move-history");
    moveContainer.innerHTML = "";
    Game.moveHistory.forEach((move, turn) => {
      // Get template element
      let template = document.querySelector("#move-history-template");
      // Clone template content
      let item = template.content.cloneNode(true);

      item.querySelector(".turn-number").innerText =
        Game.moveHistory.length - turn;

      item.querySelector(".start-piece img").src = move.startPiece.imgSrc;
      item.querySelector(
        ".coordinates"
      ).innerText = `${move.originId} to ${move.destId}`;

      if (move.capturedPiece.type != EMPTY) {
        item.querySelector(".captured-piece img").src =
          move.capturedPiece.imgSrc;
        item.querySelector(".captured-piece").classList.remove("hidden");
      }

      if (move.check) {
        item.querySelector(".check").classList.remove("hidden");
      }

      if (move.specialMove) {
        item.querySelector(".special-move").innerText = `(${move.specialMove})`;
        item.querySelector(".special-move").classList.remove("hidden");
      }

      moveContainer.appendChild(item);
    });

    // alert box
    let lastMove = Game.moveHistory[0];
    if (Game.invalidMessage != "") {
      document.getElementById("invalid-alert").classList.remove("hidden");
      document.getElementById("invalid-message").textContent =
        Game.invalidMessage;
    } else {
      document.getElementById("invalid-alert").classList.add("hidden");
    }

    if (!this.gameOver && lastMove && lastMove.check) {
      document.getElementById("check-alert").classList.remove("hidden");
      document.getElementById(
        "check-message"
      ).textContent = `${this.turn}'s king is in danger. Can you save him?`;
    } else {
      document.getElementById("check-alert").classList.add("hidden");
    }

    if (this.turnCount == 0) {
      document.getElementById("welcome-alert").classList.remove("hidden");
    } else {
      document.getElementById("welcome-alert").classList.add("hidden");
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
    document.getElementById("mode-toggle").classList.toggle("bg-primary-600");
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

    // check if actually making a move
    if (originId == destId) {
      return;
    }

    if (this.board.isValidMove(this.turn, originId, destId)) {
      // make the move and save the undo function
      let undoFunction = this.board.move(originId, destId, this.capturedPieces);
      this.undoManager.push(undoFunction);
      this.turnCount++;
      this.turn = this.turn == WHITE ? BLACK : WHITE;
      if (Game.lastCapture == 0) {
        this.boardHistory = [];
      } else {
        this.boardHistory.push(this.board.getStringRepresentation());
      }
      Game.invalidMessage = "";
      this.isOver();
    }
    this.print();
  };

  /**
   * Checks if the current board position has occurred for the third time (repetition).
   * @returns {boolean} True if the board position has occurred for the third time, otherwise false.
   */
  isThirdRepetition() {
    let board = this.boardHistory[this.boardHistory.length - 1];
    let matchCount = 0;

    for (let i = 0; i < this.boardHistory.length; i++) {
      if (this.boardHistory[i] == board) {
        matchCount++; // Count the number of times the current board position matches previous positions.
      }
    }

    return matchCount >= 3; // Returns true if the board position has occurred for the third time.
  }

  /**
   * Check if the game is over.
   */
  isOver() {
    let gameOver = false;
    let gameOverHeader = document.getElementById("game-over-header");
    let gameOverMessage = document.getElementById("game-over-message");
    let gameOverCardHeader = document.getElementById("game-over-card-header");
    let gameOverCardMessage = document.getElementById("game-over-card-message");

    let header;
    let message;

    // Check for 50 turns since last capture
    if (Game.lastCapture >= 50) {
      gameOver = true;
    }

    // Check for third repetition
    if (this.isThirdRepetition()) {
      gameOver = true;

      // Display draw - threefold repetition information
      header = `Draw - Threefold Repetition`;
      message = `The current position has occurred three times in this match. Game ends by draw.`;
    }

    // Check for insufficient material
    if (this.board.isInsufficientMaterial()) {
      gameOver = true;

      // Display draw - insufficient material information
      header = `Draw - Insufficient Mating Material`;
      message = `Both sides lack the pieces to achieve checkmate. There is no way for either side to checkmate the other. Game ends by draw.`;
    }

    // Check for mate and check
    let isMate = this.board.isMate(this.turn);
    let isCheck = this.board.findKing(this.turn).isInCheck(this.board.grid);

    if (isMate) {
      gameOver = true;
      if (isCheck) {
        // Display checkmate - winning side information
        header = `Checkmate - ${this.turn == WHITE ? BLACK : WHITE} Wins!`;
        message = `${this.turn == WHITE ? BLACK : WHITE} wins by checkmate. ${
          this.turn
        } cannot make any move to get out of check.`;
      } else {
        // Display draw - stalemate information
        header = `Draw - Stalemate`;
        message = `${this.turn} is not currently in check, but there is no valid move that will not place their king in check.`;
      }
    }

    gameOverHeader.textContent = header;
    gameOverCardHeader.textContent = header;
    gameOverMessage.textContent = message;
    gameOverCardMessage.textContent = message;

    if (gameOver) {
      this.showGameOver();
      document.getElementById("game-over-card").classList.remove("hidden");
      this.gameOver = true;
    } else {
      document.getElementById("game-over-card").classList.add("hidden");
    }

    Game.invalidMessage = "";

    return gameOver;
  }

  /**
   * Displays the game over modal.
   * @returns {void}
   */
  showGameOver() {
    let container = document.getElementById("game-over-container");
    let backdrop = document.getElementById("game-over-backdrop");
    let modal = document.getElementById("game-over-modal");

    container.classList.remove("hidden");
    backdrop.classList.remove("hidden", "ease-in", "duration-200");
    modal.classList.remove("hidden");

    modal
      .animate(
        [
          {
            opacity: "0",
            transform: "translateY(4px) scale(0.95)",
            "transform-origin": "center",
          },
          {
            opacity: "100",
            transform: "translateY(0) scale(1)",
            "transform-origin": "center",
          },
        ],
        {
          duration: 300,
          easing: "ease-out",
        }
      )
      .finished.then(() => {
        // Animation finished callback
      });

    backdrop
      .animate([{ opacity: "0" }, { opacity: "100" }], {
        duration: 300,
        easing: "ease-out",
      })
      .finished.then(() => {
        // Animation finished callback
      });

    let btn = document.getElementById("close-game-over-btn");
    let newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", () => this.hideGameOver());
  }

  /**
   * Hides the game over modal.
   * @return {void}
   */
  hideGameOver() {
    let container = document.getElementById("game-over-container");
    let backdrop = document.getElementById("game-over-backdrop");
    let modal = document.getElementById("game-over-modal");

    modal
      .animate(
        [
          {
            opacity: "100",
            transform: "translateY(0) scale(1)",
            "transform-origin": "center",
          },
          {
            opacity: "0",
            transform: "translateY(4px) scale(0.95)",
            "transform-origin": "center",
          },
        ],
        {
          duration: 200,
          easing: "ease-in",
        }
      )
      .finished.then(() => {
        modal.classList.add("hidden");
      });

    backdrop
      .animate([{ opacity: "100" }, { opacity: "0" }], {
        duration: 200,
        easing: "ease-in",
      })
      .finished.then(() => {
        backdrop.classList.add("hidden");
        container.classList.add("hidden");
      });
  }

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
    this.boardHistory.pop();
    this.print();
  }
}
