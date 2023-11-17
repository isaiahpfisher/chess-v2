import { QUEEN } from "../Board.js";
import { Piece } from "../Piece.js";

/**
 * Represents a queen on a chessboard.
 * Derived class of Piece.
 */
export class Queen extends Piece {
  /**
   * @param {string} color - The color of the Queen (either BLACK or WHITE).
   * @param {number} row - The row of the Queen on the Board (0 - 7).
   * @param {number} col - The column of the Queen on the Board (0 - 7).
   */
  constructor(color, row, col) {
    super(QUEEN, color, row, col);
    this.imgSrc = `./assets/${color}-queen.svg`; // Set the image source for the Queen based on its color
  }

  /**
   * Checks if a Queen can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(grid, originId, destId) {
    let validMove = true;

    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let rowDiff = Math.abs(startCoordinates.row - endCoordinates.row);
    let colDiff = Math.abs(startCoordinates.col - endCoordinates.col);

    // moved non-linearly
    if (rowDiff != colDiff && !(rowDiff == 0 || colDiff == 0)) {
      validMove = false;
    }

    return validMove;
  }
}
