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
  isValidMove(grid, boardMove, originId, destId) {
    return false;
  }

  /**
   * Does piece-specific move actions for the Empty piece (does nothing)
   * @param {Array} grid - The grid representing the game board.
   * @param {string} originId - The ID of the piece's current position.
   * @param {string} destId - The ID of the destination position.
   * @returns {void}
   */
  move(grid, originId, destId) {
    this.enPassant = false;
  }
}
