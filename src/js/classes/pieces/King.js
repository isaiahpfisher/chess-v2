import {
  BISHOP,
  BLACK,
  EMPTY,
  KING,
  NUM_COLS,
  NUM_ROWS,
  ROOK,
} from "../Board.js";
import { Game } from "../Game.js";
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
    this.imgSrc = `assets/${color.toLowerCase()}-king.svg`; // Set the image source for the King based on its color
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
  isValidMove(grid, boardMove, originId, destId) {
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
      else if (this.isInCheck(grid)) {
        validMove = false;
      }

      if (validMove) {
        // simulate the move and check if still in check
        let undoFunction = boardMove(
          originId,
          Piece.getA1Notation(midRow, midCol),
          [],
          true
        ); // simulation = true;
        let inCheck = this.isInCheck(grid, true);
        undoFunction();
        if (inCheck) {
          validMove = false;
        }
      }
    }
    // moved more than one space
    else if (rowDiff > 1 || colDiff > 1) {
      validMove = false;
    }

    return validMove;
  }

  /**
   * Moves a piece on the chess grid from the origin cell to the destination cell.
   * If the move involves castling, it also moves the corresponding rook.
   * @param {Piece[][]} grid - The chess grid.
   * @param {string} originId - The ID of the origin cell.
   * @param {string} destId - The ID of the destination cell.
   * @returns {Function} - A function that can be used to undo the move.
   */
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
      grid[rookRowDest][rookColDest].row = rookRowDest;
      grid[rookRowDest][rookColDest].col = rookColDest;
      grid[rookRowDest][rookColDest].hasMoved = true;

      return () => {
        grid[rookRow][rookCol] = grid[rookRowDest][rookColDest];
        grid[rookRowDest][rookColDest] = new Empty(rookRowDest, rookColDest);
        grid[rookRow][rookCol].row = rookRow;
        grid[rookRow][rookCol].col = rookCol;
        grid[rookRow][rookCol].hasMoved = false;
      };
    }
  }

  /**
   * Checks if the current king is in check.
   * @param {Array<Array<Piece>>} grid - The game grid representing the chessboard.
   * @returns {boolean} - Returns true if the king is in check, false otherwise.
   */
  isInCheck(grid) {
    // Initialize isInCheck flag as false
    let isInCheck = false;

    // Iterate over each row and column of the grid
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        // Get the current piece at the current position
        let piece = grid[row][col];

        // Check if the piece is not empty and its color is different from the current king's color
        if (
          !piece.isEmpty() &&
          piece.color != this.color &&
          // piece.type != KING
        ) {
          // Check if the piece can move to the king's position and if there is no piece blocking its way

          let validMove = piece.isValidMove(
            grid,
            undefined,
            Piece.getA1Notation(row, col),
            Piece.getA1Notation(this.row, this.col)
          );
          let pieceInWay = piece.isPieceInWay(
            grid,
            Piece.getA1Notation(row, col),
            Piece.getA1Notation(this.row, this.col)
          );

          // If the piece has a valid move and there is no piece blocking its way, set isInCheck to true
          if (validMove && !pieceInWay) {
            isInCheck = true;
          }
        }
      }
    }

    // Return the isInCheck flag indicating whether the king is in check or not
    return isInCheck;
  }
}
