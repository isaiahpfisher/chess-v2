import { EMPTY, KNIGHT, NUM_COLS, NUM_ROWS } from "./Board.js";

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
  enPassant = false;

  constructor(type, color, row, col) {
    this.type = type;
    this.color = color;
    this.row = row;
    this.col = col;
    this.hasMoved = false;
  }

  /**
   * Checks if the value is empty.
   *
   * @returns {boolean} Returns true if the value is empty, otherwise returns false.
   */
  isEmpty() {
    return this.type == EMPTY;
  }

  /**
   * Checks if there is a piece in the way between the specified origin and destination coordinates on the grid.
   *
   * @param {Array} grid - The grid containing the pieces.
   * @param {string} originId - The ID of the origin coordinate.
   * @param {string} destId - The ID of the destination coordinate.
   * @returns {boolean} Returns true if there is a piece in the way, otherwise returns false.
   */
  isPieceInWay(grid, originId, destId) {
    let pieceInWay = false;

    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let maxRow =
      startCoordinates.row > endCoordinates.row
        ? startCoordinates.row
        : endCoordinates.row;
    let minRow =
      startCoordinates.row < endCoordinates.row
        ? startCoordinates.row
        : endCoordinates.row;
    let maxCol =
      startCoordinates.col > endCoordinates.col
        ? startCoordinates.col
        : endCoordinates.col;
    let minCol =
      startCoordinates.col < endCoordinates.col
        ? startCoordinates.col
        : endCoordinates.col;

    // moving front to back
    if (minRow != maxRow && minCol == maxCol) {
      for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
          if (col == minCol && row > minRow && row < maxRow) {
            if (!grid[row][col].isEmpty()) {
              pieceInWay = true;
            }
          }
        }
      }
    }

    // side to side
    else if (minRow == maxRow && minCol != maxCol) {
      for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
          if (row == minRow && col > minCol && col < maxCol) {
            if (!grid[row][col].isEmpty()) {
              pieceInWay = true;
            }
          }
        }
      }
    }

    // diagonal moves
    else {
      for (let row = 0; row < NUM_ROWS; row++) {
        for (let col = 0; col < NUM_COLS; col++) {
          if (
            row > minRow &&
            row < maxRow &&
            col > minCol &&
            col < maxCol &&
            Math.abs(row - startCoordinates.row) ==
              Math.abs(col - startCoordinates.col)
          ) {
            if (!grid[row][col].isEmpty()) {
              pieceInWay = true;
            }
          }
        }
      }
    }

    if (this.type == KNIGHT) {
      pieceInWay = false;
    }

    return pieceInWay;
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
