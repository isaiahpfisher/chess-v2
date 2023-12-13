import { ROOK } from "../Board.js";
import { Piece } from "../Piece.js";

/**
 * Represents a rook on a chessboard.
 * Derived class of Piece.
 */
export class Rook extends Piece {
  /**
   * @param {string} color - The color of the Rook (either BLACK or WHITE).
   * @param {number} row - The row of the Rook on the Board (0 - 7).
   * @param {number} col - The column of the Rook on the Board (0 - 7).
   */
  constructor(color, row, col) {
    super(ROOK, color, row, col);
    this.imgSrc = `assets/${color}-rook.svg`; // Set the image source for the Rook based on its color
  }

  /**
   * Checks if a Rook can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(grid, boardMove, originId, destId) {
    let validMove = true;

    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    if (
      startCoordinates.col != endCoordinates.col &&
      startCoordinates.row != endCoordinates.row
    ) {
      validMove = false;
    }

    return validMove;
  }

  /**
   * Does piece-specific move actions for the Rook
   * @param {Array} grid - The grid representing the game board.
   * @param {string} originId - The ID of the piece's current position.
   * @param {string} destId - The ID of the destination position.
   * @returns {void}
   */
  move(grid, originId, destId) {}
}
