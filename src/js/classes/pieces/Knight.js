import { BLACK_DIRECTION, KNIGHT, WHITE, WHITE_DIRECTION } from "../Board.js";
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
    this.imgSrc = `assets/${color.toLowerCase()}-knight.svg`; // Set the image source for the Knight based on its color
  }

  /**
   * Checks if a Knight can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(grid, boardMove, originId, destId) {
    let validMove = true;
    let direction = this.color == WHITE ? WHITE_DIRECTION : BLACK_DIRECTION;

    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let rowDiff = Math.abs(startCoordinates.row - endCoordinates.row);
    let colDiff = Math.abs(startCoordinates.col - endCoordinates.col);

    if (
      startCoordinates.row == endCoordinates.row ||
      startCoordinates.col == endCoordinates.col ||
      rowDiff + colDiff != 3
    ) {
      validMove = false;
    }

    return validMove;
  }

  /**
   * Does piece-specific move actions for the Knight
   * @param {Array} grid - The grid representing the game board.
   * @param {string} originId - The ID of the piece's current position.
   * @param {string} destId - The ID of the destination position.
   * @returns {void}
   */
  move(grid, originId, destId) {}
}
