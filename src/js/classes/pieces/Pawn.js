import { PAWN } from "../Board.js";
import { Piece } from "../Piece.js";

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
  }

  /**
   * Checks if a Pawn can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(grid, originId, destId) {
    return true;
  }
}