import { EMPTY } from "./Board.js";

/**
 * Represents a piece on a chessboard.
 * BASE class. Should never declare an instance of this class.
 */
export class Piece {
  imgSrc;
  color;
  row;
  col;
  type;

  constructor(type, color, row, col) {
    this.type = type;
    this.color = color;
    this.row = row;
    this.col = col;
    this.hasMoved = false;
  }

  isEmpty() {
    return this.type == EMPTY;
  }

  /**
   * Converts the given row and column indices into a string in A1 notation.
   * @param {number} row - The row index.
   * @param {number} col - The column index.
   * @returns {string} The A1 notation string.
   */
  static getA1Notation(row, col) {
    let letter = (col + 1 + 9).toString(36).toUpperCase();
    let number = row + 1;
    return letter + number;
  }

  /**
   * Converts the given A1 notation string back into row and column indices.
   * @param {string} a1Notation - The A1 notation string.
   * @returns {Object} An object containing the row and column indices.
   */
  static getCoordinates(a1Notation) {
    return {
      row: parseInt(a1Notation[1]) - 1, // minus one to get 0-based index
      col: a1Notation.charCodeAt(0) - 65, // 65 is the charCode of 'A'
    };
  }
}
