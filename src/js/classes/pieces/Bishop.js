import { BISHOP } from "../Board.js";
import { Piece } from "../Piece.js";

/**
 * Represents a bishop on a chessboard.
 * Derived class of Piece.
 */
export class Bishop extends Piece {
  /**
   * @param {string} color - The color of the Bishop (either BLACK or WHITE).
   * @param {number} row - The row of the Bishop on the Board (0 - 7).
   * @param {number} col - The column of the Bishop on the Board (0 - 7).
   */
  constructor(color, row, col) {
    super(BISHOP, color, row, col);
    this.imgSrc = `./assets/${color}-bishop.svg`; // Set the image source for the Bishop based on its color
  }

  /**
   * Checks if a Bishop can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(grid, originId, destId) {
    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let validMove = true;
    let rowDiff = Math.abs(startCoordinates.row - endCoordinates.row);
    let colDiff = Math.abs(startCoordinates.col - endCoordinates.col);

    if (rowDiff != colDiff) {
      validMove = false;
    }

    return validMove;
  }

  /**
   * Moves a piece on the grid from its current position (originId) to a specified position (destId).
   * @param {Array} grid - The grid representing the game board.
   * @param {string} originId - The ID of the piece's current position.
   * @param {string} destId - The ID of the destination position.
   */
  move(grid, originId, destId) {
    // Get the end coordinates (row and column) of the destination position
    let endCoordinates = Piece.getCoordinates(destId);

    // Set the piece's row and column to the end coordinates
    this.row = endCoordinates.row;
    this.col = endCoordinates.col;

    // Mark the piece as moved
    this.hasMoved = true;
  }
}
