import { BLACK, Board, EMPTY, NUM_COLS, NUM_ROWS, WHITE } from "./Board.js";
import { Piece } from "./Piece.js";

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
    this.gameResult = "";
    Game.lastCapture = 0;
    Game.invalidMessage = "";
    Game.moveHistory = [];
    this.print();
  }

  /**
   * Prints all aspects of the game to the screen.
   */
  print() {
    this.board.print(this.turn);

    // basic stats
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

      if (!this.gameOver && move.check) {
        item.querySelector(".check").classList.remove("hidden");
      }

      if (turn == 0 && this.gameOver) {
        item.querySelector(".game-over").textContent = this.gameResult;
        item.querySelector(".game-over").classList.remove("hidden");
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

    if (Game.invalidMessage == "" && this.turnCount == 0) {
      document.getElementById("welcome-alert").classList.remove("hidden");
    } else {
      document.getElementById("welcome-alert").classList.add("hidden");
    }

    if (!this.gameOver) {
      document.getElementById("game-over-card").classList.add("hidden");
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

      newImg.addEventListener("click", this.clickSpace);
      newImg.addEventListener("mouseover", this.hoverSpace);
      newImg.addEventListener("mouseout", this.hoverEnd);
      newImg.addEventListener("drop", this.dropPiece);
      newImg.addEventListener("dragover", this.dragOverSpace);
      newImg.addEventListener("dragleave", this.dragLeaveSpace);
      newImg.addEventListener("dragstart", this.dragPieceStart);
      newImg.addEventListener("dragend", this.dragEnd);
      newImg.querySelector("img").draggable = true;
    });

    // for game mode
    document
      .querySelector("#mode-toggle")
      .addEventListener("click", this.changeGameMode);
  }

  /**
   * Removes all event listeners on the board to disable new moves.
   * @returns {void}
   */
  removeEventListeners() {
    // for drag-and-drop
    document.querySelectorAll(".chessboard .row .cell").forEach((img) => {
      img.removeEventListener("click", this.clickSpace);
      img.removeEventListener("mouseover", this.hoverSpace);
      img.removeEventListener("mouseout", this.hoverEnd);
      img.removeEventListener("drop", this.dropPiece);
      img.removeEventListener("dragover", this.dragOverSpace);
      img.removeEventListener("dragleave", this.dragLeaveSpace);
      img.removeEventListener("dragstart", this.dragPieceStart);
      img.removeEventListener("dragend", this.dragEnd);
      img.querySelector("img").draggable = false;
    });

    // for game mode
    document
      .querySelector("#mode-toggle")
      .removeEventListener("click", this.changeGameMode.bind(this));
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

    // Check if it's the computer's turn and do the computer move
    if (!this.gameOver && Game.computerMode && this.turn == BLACK) {
      setTimeout(() => {
        this.doComputerMove();
      }, 100);
    }

    this.print();
  }

  setOrigin(cell) {
    cell.classList.add("origin", "!border-8", "!border-primary-700");
  }

  removeOrigin(cell) {
    cell.classList.remove("origin", "!border-8", "!border-primary-700");
  }

  hoverSpace = (e) => {
    let target = e.target.closest(".cell");

    if (
      document.querySelector(".origin") &&
      !target.classList.contains("origin")
    ) {
      target.classList.add("!border-primary-700");
    }
  };

  hoverEnd = (e) => {
    let target = e.target.closest(".cell");
    if (!target.classList.contains("origin")) {
      target.classList.remove("!border-primary-700");
    }
  };

  clickSpace = (e) => {
    let target = e.target.closest(".cell");

    if (target.classList.contains("origin")) {
      this.removeOrigin(target);
    } else if (document.querySelector(".origin")) {
      this.processInput(document.querySelector(".origin").id, target.id);
      this.removeOrigin(document.querySelector(".origin"));
    } else if (target.querySelector("img").draggable) {
      this.setOrigin(target);
    }
  };

  /**
   * Prevents default behavior when a chess piece is dragged over.
   * Runs when a chess piece is dragged over e.target
   * @param {Event} e
   * @returns {void}
   */
  dragOverSpace = (e) => {
    e.preventDefault();
    e.target.closest(".cell").classList.add("!border-primary-700");
  };

  /**
   * Runs when drag event stops.
   * Removes the opacity class after a drag and drop.
   * @param {Event} e
   * @returns {void}
   */
  dragEnd = (e) => {
    e.target.classList.remove("opacity-25");

    if (document.querySelector(".origin")) {
      this.removeOrigin(document.querySelector(".origin"));
    }
  };

  /**
   * Prevents default behavior when a dragged chess piece leaves a space on the chessboard.
   * Runs when a dragged chess piece leaves a space on the chessboard.
   * @param {Event} e
   * @returns {void}
   */
  dragLeaveSpace = (e) => {
    e.preventDefault();
    if (!e.target.closest(".cell").classList.contains("origin")) {
      e.target.closest(".cell").classList.remove("!border-primary-700");
    }
  };

  /**
   * Associates the id of the origin cell with the dragged element.
   * Runs when an element is first dragged
   * @param {Event} e
   * @returns {void}
   */
  dragPieceStart = (e) => {
    e.dataTransfer.setData("text", e.target.closest(".cell").id);
    e.dataTransfer.effectAllowed = "move";
    e.target.closest(".cell").querySelector("img").classList.add("opacity-25");
    this.setOrigin(e.target.closest(".cell"));
  };

  /**
   * Handles dropping a piece from one cell to another.
   *
   * @param {Event} e - The event object triggered by the drop.
   */
  dropPiece = (e) => {
    e.preventDefault();

    // Get the ID of the cell where the piece was originally dragged from
    let originId = e.dataTransfer.getData("text");

    // Get the ID of the cell where the piece is being dropped
    let destId = e.target.closest(".cell").id;

    // Remove the "border-primary-700" class from the cells
    document
      .getElementById(originId)
      .classList.remove("!border-primary-700", "!border-8");
    document.getElementById(destId).classList.remove("!border-primary-700");

    // If the origin and destination IDs are different, process the input
    if (originId !== destId) {
      this.processInput(originId, destId);
    }
  };

  /**
   * Processes the input of a move from originId to destId.
   *
   * @param {string} originId - The ID of the origin cell.
   * @param {string} destId - The ID of the destination cell.
   */
  processInput(originId, destId) {
    // Check if the move is valid
    if (this.board.isValidMove(this.turn, originId, destId)) {
      // Perform the move
      this.doMove(originId, destId, false); // simulation = false

      // Check if the game is over
      this.isOver();
    }

    // Print the current state of the game
    this.print();

    // Check if it's the computer's turn and do the computer move
    if (!this.gameOver && Game.computerMode && this.turn == BLACK) {
      setTimeout(() => {
        this.doComputerMove();
      }, 100);
    }
  }

  /**
   * Moves a piece from the origin square to the destination square.
   * Saves the undo function and manages game state.
   *
   * @param {string} originId - The ID of the origin square.
   * @param {string} destId - The ID of the destination square.
   * @param {boolean} simulation - Indicates whether this is a simulation.
   */
  doMove(originId, destId, simulation) {
    // make the move and save the undo function
    let undoFunction = this.board.move(
      originId,
      destId,
      this.capturedPieces,
      simulation
    );

    // add the undo function to the undo manager
    this.undoManager.push(undoFunction);

    // increment the turn
    this.turnCount++;
    this.turn = this.turn == WHITE ? BLACK : WHITE;

    // manage the board history and turns since last capture
    if (Game.lastCapture == 0) {
      this.boardHistory = [];
    } else {
      this.boardHistory.push(this.board.getStringRepresentation());
    }
  }

  /**
   * Executes the computer's move.
   */
  doComputerMove() {
    // Find the best move using the findBestMove method
    let bestMove = this.findBestMove(BLACK);

    // Execute the best move by calling doMove with simulation = false
    this.doMove(bestMove.originId, bestMove.destId, false);

    // Reset the invalid message
    Game.invalidMessage = "";

    // Print the updated game state
    this.print();

    // Check if the game is over
    this.isOver();
  }

  /**
   * Finds the best move for the current player.
   * @returns {Object} The best move for the current player.
   */
  findBestMove() {
    // Generate valid moves for the current player
    let validBlackMoves = this.board.generateValidMoves(BLACK);

    let bestBlackScore = -Infinity;
    let bestBlackMove = null;

    // Iterate through each valid black move
    for (let blackMove of validBlackMoves) {
      // Simulate the black move
      this.doMove(blackMove.originId, blackMove.destId, true);

      let initialScore = this.board.evaluateBoard(BLACK);

      // If the initial score is greater than 1000 (checkmate), return the black move
      if (initialScore > 1000) {
        this.undo();
        return blackMove;
      }

      let bestWhiteScore = -Infinity;
      let bestWhiteMove = null;

      // Generate valid moves for the opponent (white)
      let validWhiteMoves = this.board.generateValidMoves(WHITE);

      // Iterate through each valid white move
      for (let whiteMove of validWhiteMoves) {
        // Simulate the white move
        this.doMove(whiteMove.originId, whiteMove.destId, true);
        let whiteScore = this.board.evaluateBoard(WHITE);

        // Undo the white move
        this.undo();

        // Update the best white move if the white score is higher
        if (whiteScore > bestWhiteScore) {
          bestWhiteScore = whiteScore;
          bestWhiteMove = whiteMove;
        }
      }

      // Simulate the best white move
      this.doMove(bestWhiteMove.originId, bestWhiteMove.destId, true);
      let blackScore = this.board.evaluateBoard(BLACK);

      // Undo the best white move
      this.undo();

      // Update the best black move if the black score is higher
      if (blackScore > bestBlackScore) {
        bestBlackScore = blackScore;
        bestBlackMove = blackMove;
      }

      // Undo the black move
      this.undo();
    }

    // Return the best black move
    return bestBlackMove;
  }

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
    let gameOverHeader = document.getElementById("game-over-header");
    let gameOverMessage = document.getElementById("game-over-message");
    let gameOverCardHeader = document.getElementById("game-over-card-header");
    let gameOverCardMessage = document.getElementById("game-over-card-message");

    let header;
    let message;

    // Check for 50 turns since last capture
    if (Game.lastCapture >= 50) {
      this.gameOver = true;
      this.gameResult = "50 Moves";
      header = `Draw - 50 Moves`;
      message = `It has been 50 moves since a piece has been captured. Game ends by draw.`;
    }

    // Check for third repetition
    if (this.isThirdRepetition()) {
      this.gameOver = true;
      this.gameResult = "3 Repetitions";

      // Display draw - threefold repetition information
      header = `Draw - Threefold Repetition`;
      message = `The current position has occurred three times in this match. Game ends by draw.`;
    }

    // Check for insufficient material
    if (this.board.isInsufficientMaterial()) {
      this.gameOver = true;
      this.gameResult = "Insufficient Material";

      // Display draw - insufficient material information
      header = `Draw - Insufficient Mating Material`;
      message = `Both sides lack the pieces to achieve checkmate. There is no way for either side to checkmate the other. Game ends by draw.`;
    }

    // Check for mate and check
    let isMate = this.board.isMate(this.turn);
    let isCheck = this.board.findKing(this.turn).isInCheck(this.board.grid);

    if (isMate) {
      this.gameOver = true;

      if (isCheck) {
        // Display checkmate - winning side information
        this.gameResult = "Checkmate";
        header = `Checkmate - ${this.turn == WHITE ? BLACK : WHITE} Wins!`;
        message = `${this.turn == WHITE ? BLACK : WHITE} wins by checkmate. ${
          this.turn
        } cannot make any move to get out of check.`;
      } else {
        // Display draw - stalemate information
        this.gameResult = "Stalemate";
        header = `Draw - Stalemate`;
        message = `${this.turn} is not currently in check, but there is no valid move that will not place their king in check.`;
      }
    }

    gameOverHeader.textContent = header;
    gameOverCardHeader.textContent = header;
    gameOverMessage.textContent = message;
    gameOverCardMessage.textContent = message;

    if (this.gameOver) {
      this.showGameOver();
      document.getElementById("game-over-card").classList.remove("hidden");
      Game.invalidMessage = "";
      this.print();
      this.changeGameMode();
      this.removeEventListeners();
    } else {
      document.getElementById("game-over-card").classList.add("hidden");
    }

    Game.invalidMessage = "";
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
    // Game.moveHistory.shift();
  }
}
