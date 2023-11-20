import { BLACK, KING } from "../Board.js";
import { Piece } from "../Piece.js";
import { Empty } from "./Empty.js";

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
    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let validMove = true;
    let rowDiff = Math.abs(startCoordinates.row - endCoordinates.row);
    let colDiff = Math.abs(startCoordinates.col - endCoordinates.col);

    // where rook SHOULD be
    let rookRow = this.color == BLACK ? 7 : 0;
    let rookCol = endCoordinates.col < startCoordinates.col ? 0 : 7;
    const rookSpot = grid[rookRow][rookCol];

    // the spot the king passes through
    let midRow = this.color == BLACK ? 7 : 0;
    let midCol = endCoordinates.col < startCoordinates.col ? 3 : 5;

    // moved non-linearly
    if (rowDiff != colDiff && !(rowDiff == 0 || colDiff == 0)) {
      validMove = false;
    }
    // castling
    else if (colDiff == 2 && rowDiff == 0) {
      // if either piece has already moved
      if (this.hasMoved || (rookSpot.type == ROOK && rookSpot.hasMoved)) {
        validMove = false;
      }
      // any pieces between them
      else if (
        endCoordinates.col < startCoordinates.col &&
        !grid[rookRow][rookCol + 1].isEmpty()
      ) {
        validMove = false;
      }
      // currently in check
      else if (this.isInCheck(grid, -1, -1, -1, -1)) {
        validMove = false;
      }
      // pass through a check
      else if (this.isInCheck(grid)) {
        validMove = false;
      }
    }
    // moved more than one space
    else if (rowDiff > 1 || colDiff > 1) {
      validMove = false;
    }

    return validMove;
  }

  move(grid, originId, destId) {
    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let colDiff = Math.abs(startCoordinates.col - endCoordinates.col);

    // if castling . . .
    if (colDiff == 2) {
      // get the rook
      let rookRow = this.color == BLACK ? 7 : 0;
      let rookCol = endCoordinates.col < startCoordinates.col ? 0 : 7;

      // rook destination
      let rookRowDest = this.color == BLACK ? 7 : 0;
      let rookColDest =
        endCoordinates.col < startCoordinates.col
          ? endCoordinates.col + 1
          : endCoordinates.col - 1;

      // move the rook
      grid[rookRowDest][rookColDest] = grid[rookRow][rookCol];
      grid[rookRow][rookCol] = new Empty(rookRow, rookCol);
    }
  }
}
