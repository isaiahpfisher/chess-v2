import { KING } from "../Board.js";
import { Piece } from "../Piece.js";

/**
 * Represents a king on a chessboard.
 * Derived class of Piece.
 */
export class King extends Piece {
  /**
   * @param {string} color - The color of the King (either BLACK or WHITE).
   * @param {number} row - The row of the King on the Board (0 - 7).
   * @param {number} col - The column of the King on the Board (0 - 7).
   */
  constructor(color, row, col) {
    super(KING, color, row, col);
    this.imgSrc = `./assets/${color}-king.svg`; // Set the image source for the King based on its color
  }

  isInCheck() {
    return false;
  }

  /**
   * Checks if a King can make the given move
   * @param {Array} grid - the board layout before the given move
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(grid, originId, destId) {
    let startRow = Piece.getCoordinates(originId).row;
    let startCol = Piece.getCoordinates(originId).col;

    let endRow = Piece.getCoordinates(destId).row;
    let endCol = Piece.getCoordinates(destId).col;

    let startPiece = grid[startRow][startCol];

    let checkResult = true;
    let rowDiff = Math.abs(startRow - endRow);
    let colDiff = Math.abs(startCol - endCol);

    // where rook SHOULD be
    let rookRow = startPiece.color == BLACK ? 7 : 0;
    let rookCol = endCol < startCol ? 0 : 7;
    const rookSpot = grid[rookRow][rookCol];

    // the spot the king passes through
    let midRow = startPiece.color == BLACK ? 7 : 0;
    let midCol = endCol < startCol ? 3 : 5;

    // moved non-linearly
    if (rowDiff != colDiff && !(rowDiff == 0 || colDiff == 0)) {
      checkResult = false;
    }
    // castling
    else if (colDiff == 2 && rowDiff == 0) {
      // if either piece has already moved
      if (startPiece.hasMoved || (rookSpot.type == ROOK && rookSpot.hasMoved)) {
        checkResult = false;
      }
      // any pieces between them
      else if (endCol < startCol && !grid[rookRow][rookCol + 1].isEmpty()) {
        checkResult = false;
      }
      // currently in check
      else if (startPiece.isInCheck(grid, -1, -1, -1, -1)) {
        checkResult = false;
      }
      // pass through a check
      else if (startPiece.isInCheck(grid, startRow, startCol, midRow, midCol)) {
        checkResult = false;
      }
    }
    // moved more than one space
    else if (rowDiff > 1 || colDiff > 1) {
      checkResult = false;
    }

    return checkResult;
  }
}
