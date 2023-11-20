import { BLACK_DIRECTION, PAWN, WHITE, WHITE_DIRECTION } from "../Board.js";
import { Piece } from "../Piece.js";
import { Empty } from "./Empty.js";

/**
 * Represents a pawn on a chessboard.
 * Derived class of Piece.
 */
export class Pawn extends Piece {
  /**
   * @param {string} color - The color of the Pawn (either BLACK or WHITE).
   * @param {number} row - The row of the Pawn on the Board (0 - 7).
   * @param {number} col - The column of the Pawn on the Board (0 - 7).
   */
  constructor(color, row, col) {
    super(PAWN, color, row, col);
    this.imgSrc = `./assets/${color}-pawn.svg`; // Set the image source for the Pawn based on its color
    this.enPassant = false;

    document
      .getElementById("promote-pawn")
      .addEventListener("click", this.promotePawn.bind(this));
  }

  /**
   * Checks if a Pawn can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(grid, originId, destId) {
    let validMove = true;
    let direction = this.color == WHITE ? WHITE_DIRECTION : BLACK_DIRECTION;

    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let rowDiff = Math.abs(startCoordinates.row - endCoordinates.row);
    let colDiff = Math.abs(startCoordinates.col - endCoordinates.col);

    // moved more than one column to the side
    if (colDiff > 1 || (colDiff > 0 && rowDiff > 1)) {
      validMove = false;
    }
    // tried to go backwards
    else if (
      endCoordinates.row * direction <
      startCoordinates.row * direction
    ) {
      validMove = false;
    }
    // tried to move sideways
    else if (startCoordinates.row == endCoordinates.row) {
      validMove = false;
    }
    // tried to move more than one/two spaces forward
    else if (rowDiff > 1 + !this.hasMoved) {
      validMove = false;
    }
    // tried to move forward into enemny
    else if (
      startCoordinates.col == endCoordinates.col &&
      !grid[endCoordinates.row][endCoordinates.col].isEmpty()
    ) {
      validMove = false;
    }
    // tried to move diagonallly (without taking enemy or en passant)
    else if (
      startCoordinates.col != endCoordinates.col &&
      grid[endCoordinates.row][endCoordinates.col].isEmpty() &&
      !grid[endCoordinates.row - direction][endCoordinates.col].enPassant
    ) {
      validMove = false;
    }

    return validMove;
  }

  /**
   * Moves a piece on the grid from the originId to the destId.
   * @param {Array<Array>} grid - The grid representing the chessboard.
   * @param {number} originId - The id of the piece's current position.
   * @param {number} destId - The id of the piece's destination position.
   * @returns {void}
   */
  move(grid, originId, destId) {
    let direction = this.color == WHITE ? WHITE_DIRECTION : BLACK_DIRECTION;

    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let rowDiff = Math.abs(startCoordinates.row - endCoordinates.row);

    // if en passant happened, remove the enemy piece
    if (grid[endCoordinates.row - direction][endCoordinates.col].enPassant) {
      grid[endCoordinates.row - direction][endCoordinates.col] = new Empty();
    }

    // if pawn moved two spaces (which is only possible on first turn), make it vulnerable to en passant attack
    if (rowDiff == 2) {
      this.enPassant = true;
    }

    // handle pawn promotion
    if (endCoordinates.row == (this.color == WHITE ? 7 : 0)) {
      this.showPawnPromotion();
    }
  }

  promotePawn(grid) {
    this.hidePawnPromotion();
    return true;
  }

  /**
   * Displays the pawn promotion modal.
   * @returns {void}
   */
  showPawnPromotion() {
    let container = document.getElementById("pawn-promotion-container");
    let backdrop = document.getElementById("pawn-promotion-backdrop");
    let modal = document.getElementById("pawn-promotion-modal");

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
  }

  /**
   * Hides the pawn promotion modal.
   * @return {void}
   */
  hidePawnPromotion() {
    let container = document.getElementById("pawn-promotion-container");
    let backdrop = document.getElementById("pawn-promotion-backdrop");
    let modal = document.getElementById("pawn-promotion-modal");

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
}
