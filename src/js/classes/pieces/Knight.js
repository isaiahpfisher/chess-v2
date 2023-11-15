import { KNIGHT } from "../Board.js";
import { Piece } from "../Piece.js";

/**
 * Represents a knight on a chessboard. 
 * Derived class of Piece.
 */
export class Knight extends Piece {

  /**
   * @param {string} color - The color of the Knight (either BLACK or WHITE).
   * @param {number} row - The row of the Knight on the Board (0 - 7).
   * @param {number} col - The column of the Knight on the Board (0 - 7).
   */
  constructor(color, row, col) {
    super(KNIGHT, color, row, col);
    this.imgSrc = `./assets/${color}-knight.svg`; // Set the image source for the Knight based on its color
  }

   /**
   * Checks if a Knight can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
   isValidMove(grid, originId, destId) {
    return true;
  }
}