import { EMPTY, EMPTY_COLOR } from "../Board.js";
import { Piece } from "../Piece.js";

/**
 * Represents an empty space on a chessboard. 
 * Derived class of Piece.
 */
export class Empty extends Piece {

  /**
   * @param {number} row - The row of the Empty space on the Board (0 - 7).
   * @param {number} col - The column of the Empty space on the Board (0 - 7).
   */
  constructor(row, col) {
    super(EMPTY, EMPTY_COLOR, row, col);
    this.imgSrc = "";
  }

   /**
   * Checks if an Empty space can make the given move (always false)
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
   isValidMove(grid, originId, destId) {
    return false;
  }

}