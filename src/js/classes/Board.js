import { Game } from "./Game.js";
import { Piece } from "./Piece.js";
import { Bishop } from "./pieces/Bishop.js";
import { Empty } from "./pieces/Empty.js";
import { King } from "./pieces/King.js";
import { Knight } from "./pieces/Knight.js";
import { Pawn } from "./pieces/Pawn.js";
import { Queen } from "./pieces/Queen.js";
import { Rook } from "./pieces/Rook.js";

// some board-related constants - accessible from anywhere
export const NUM_ROWS = 8;
export const NUM_COLS = 8;
export const WHITE = "White";
export const BLACK = "Black";
export const EMPTY_COLOR = "empty-color";
export const PAWN = "Pawn";
export const KNIGHT = "Knight";
export const BISHOP = "Bishop";
export const ROOK = "Rook";
export const QUEEN = "Queen";
export const KING = "King";
export const EMPTY = "empty";
export const WHITE_DIRECTION = 1;
export const BLACK_DIRECTION = -1;

/**
 * Represents the chessboard in a chess game.
 */
export class Board {
  grid = [];
  lastPieceMoved = new Empty(-1, -1);

  /**
   * Builds the starting layout of a new game of chess.
   */
  constructor() {
    // white first row
    this.grid[0] = [];
    this.grid[0][0] = new Rook(WHITE, 0, 0);
    this.grid[0][1] = new Knight(WHITE, 0, 1);
    this.grid[0][2] = new Bishop(WHITE, 0, 2);
    this.grid[0][3] = new Queen(WHITE, 0, 3);
    this.grid[0][4] = new King(WHITE, 0, 4);
    this.grid[0][5] = new Bishop(WHITE, 0, 5);
    this.grid[0][6] = new Knight(WHITE, 0, 6);
    this.grid[0][7] = new Rook(WHITE, 0, 7);

    // white second row
    this.grid[1] = [];
    this.grid[1][0] = new Pawn(this, WHITE, 1, 0);
    this.grid[1][1] = new Pawn(this, WHITE, 1, 1);
    this.grid[1][2] = new Pawn(this, WHITE, 1, 2);
    this.grid[1][3] = new Pawn(this, WHITE, 1, 3);
    this.grid[1][4] = new Pawn(this, WHITE, 1, 4);
    this.grid[1][5] = new Pawn(this, WHITE, 1, 5);
    this.grid[1][6] = new Pawn(this, WHITE, 1, 6);
    this.grid[1][7] = new Pawn(this, WHITE, 1, 7);

    // empty middle rows
    for (let row = 2; row < NUM_ROWS - 2; row++) {
      this.grid[row] = [];
      for (let col = 0; col < NUM_COLS; col++) {
        this.grid[row][col] = new Empty(row, col);
      }
    }

    // black second row
    this.grid[6] = [];
    this.grid[6][0] = new Pawn(this, BLACK, 6, 0);
    this.grid[6][1] = new Pawn(this, BLACK, 6, 1);
    this.grid[6][2] = new Pawn(this, BLACK, 6, 2);
    this.grid[6][3] = new Pawn(this, BLACK, 6, 3);
    this.grid[6][4] = new Pawn(this, BLACK, 6, 4);
    this.grid[6][5] = new Pawn(this, BLACK, 6, 5);
    this.grid[6][6] = new Pawn(this, BLACK, 6, 6);
    this.grid[6][7] = new Pawn(this, BLACK, 6, 7);

    // black first row
    this.grid[7] = [];
    this.grid[7][0] = new Rook(BLACK, 7, 0);
    this.grid[7][1] = new Knight(BLACK, 7, 1);
    this.grid[7][2] = new Bishop(BLACK, 7, 2);
    this.grid[7][3] = new Queen(BLACK, 7, 3);
    this.grid[7][4] = new King(BLACK, 7, 4);
    this.grid[7][5] = new Bishop(BLACK, 7, 5);
    this.grid[7][6] = new Knight(BLACK, 7, 6);
    this.grid[7][7] = new Rook(BLACK, 7, 7);
  }

  /**
   * Prints the current board layout to the screen.
   */
  print() {
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        let cellId = Piece.getA1Notation(row, col);
        document.querySelector(`#${cellId}`).piece = this.grid[row][col];
        document.querySelector(`#${cellId}`).querySelector("img").src =
          this.grid[row][col].imgSrc;
      }
    }
  }

  /**
   * Checks if the given move is valid.
   * @param {string} turn - either WHITE or BLACK
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(turn, originId, destId) {
    let validMove = true;

    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    // get pieces
    let startPiece = this.grid[startCoordinates.row][startCoordinates.col];
    let endPiece = this.grid[endCoordinates.row][endCoordinates.col];

    // Check if startPiece is invalid
    if (startPiece.isEmpty()) {
      validMove = false;
      Game.invalidMessage = `Invalid starting location. Please choose a starting location with one of your pieces.`;
    }

    // Check if startPiece is from the right team
    else if (turn != startPiece.color) {
      validMove = false;
      Game.invalidMessage = `It is ${turn}'s turn. Please choose a starting location with a ${turn} piece.`;
    }

    // Checks if move is on top of same team
    else if (startPiece.color == endPiece.color) {
      validMove = false;
      Game.invalidMessage = `You cannot move to a space that already has one of your pieces. Please try again.`;
    }
    // checking if piece is in the way
    else if (startPiece.isPieceInWay(this.grid, originId, destId)) {
      validMove = false;
      Game.invalidMessage = `There is a piece in the way. Only knights can jump over pieces. Please try again.`;
    }

    // piece-specific checks
    else if (!startPiece.isValidMove(this.grid, originId, destId)) {
      validMove = false;
      Game.invalidMessage = `${startPiece.type}s cannot move that way. Please try again.`;
    }

    // in check?
    if (validMove) {
      // currently in check?
      let currentCheck = this.findKing(turn).isInCheck(this.grid);

      // simulate the move and check if still in check
      let undoFunction = this.move(originId, destId, []);
      let stillCheck = this.findKing(turn).isInCheck(this.grid);
      undoFunction();

      // handle error message
      if (stillCheck) {
        validMove = false;
        if (currentCheck) {
          Game.invalidMessage = `${turn}'s king is currently in check. Please try again.`;
        } else {
          Game.invalidMessage = `That move would place ${turn}'s king in check. Please try again.`;
        }
      }
    }

    if (validMove) {
      Game.invalidMessage = "";
    }

    return validMove;
  }

  /**
   * Moves a piece from its current position (originId) to a specified position (destId) on the grid.
   * @param {string} originId - The ID of the piece's current position.
   * @param {string} destId - The ID of the destination position.
   * @returns {function} - Returns an undo function to undo the move.
   */
  move(originId, destId, capturedPieces, moveHistory) {
    // Get the start and end coordinates (row and column)
    let startCoordinates = Piece.getCoordinates(originId);
    let endCoordinates = Piece.getCoordinates(destId);

    let piece = this.grid[startCoordinates.row][startCoordinates.col];
    let endPiece = this.grid[endCoordinates.row][endCoordinates.col];

    let moveSummary = {
      startPiece: piece,
      capturedPiece: endPiece,
      originId: originId,
      destId: destId,
    };

    let direction = piece.color == WHITE ? WHITE_DIRECTION : BLACK_DIRECTION;
    let colDiff = Math.abs(startCoordinates.col - endCoordinates.col);

    let initialPieceHasMoved = piece.hasMoved;
    let initialEnPassant = piece.enPassant;
    let initialLastCapture = Game.lastCapture;
    let initialLastPieceMoved = this.lastPieceMoved;
    let initialLastPieceMovedEnPassant = this.lastPieceMoved.enPassant;

    // reset or increment turns since last capture and push captured pieces to capturedPieces array
    if (!this.grid[endCoordinates.row][endCoordinates.col].isEmpty()) {
      Game.lastCapture = 0;
      capturedPieces.push(endPiece.imgSrc);
    } else if (
      piece.type == PAWN &&
      endCoordinates.row - direction >= 0 &&
      endCoordinates.row - direction <= 7 &&
      this.grid[endCoordinates.row - direction][endCoordinates.col].enPassant
    ) {
      Game.lastCapture = 0;
      moveSummary.specialMove = "En Passant";
      moveSummary.capturedPiece =
        this.grid[endCoordinates.row - direction][endCoordinates.col];
      capturedPieces.push(
        this.grid[endCoordinates.row - direction][endCoordinates.col].imgSrc
      );
    } else {
      Game.lastCapture++;
    }

    // check for castling for moveSummary
    if (piece.type == KING && colDiff > 1) {
      moveSummary.specialMove = "Castled";
    }

    // does pieces specific actions for each piece before making the move
    let undoPieceMove = piece.move(this.grid, originId, destId);

    // define function to undo move
    let undoFunction = () => {
      piece.row = startCoordinates.row;
      piece.col = startCoordinates.col;
      piece.hasMoved = initialPieceHasMoved;
      piece.enPassant = initialEnPassant;
      Game.lastCapture = initialLastCapture;

      this.lastPieceMoved = initialLastPieceMoved;
      this.lastPieceMoved.enPassant = initialLastPieceMovedEnPassant;

      this.grid[startCoordinates.row][startCoordinates.col] = piece;
      this.grid[endCoordinates.row][endCoordinates.col] = endPiece;

      if (undoPieceMove) {
        undoPieceMove();
      }
    };

    piece = this.grid[startCoordinates.row][startCoordinates.col];

    // Set the piece at the destination position to be the same as the piece at the origin position
    this.grid[endCoordinates.row][endCoordinates.col] = piece;

    // Set the piece at the origin position to be an Empty piece
    this.grid[startCoordinates.row][startCoordinates.col] = new Empty(
      startCoordinates.row,
      startCoordinates.col
    );

    // update some properties on the starting piece
    piece.row = endCoordinates.row;
    piece.col = endCoordinates.col;
    piece.hasMoved = true;

    // set enPassant to false on the last piece moved
    // update lastPieceMoved
    this.lastPieceMoved.enPassant = false;
    this.lastPieceMoved = piece;

    // if called from Game.js, push the moveSummary to the moveHistory
    if (moveHistory) {
      // check if other color in check
      moveSummary.check = this.findKing(
        piece.color == WHITE ? BLACK : WHITE
      ).isInCheck(this.grid);
      moveHistory.unshift(moveSummary);
    }

    return undoFunction;
  }

  findKing(color) {
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        let piece = this.grid[row][col];
        if (piece.type == KING && piece.color == color) {
          return piece;
        }
      }
    }
  }
}
