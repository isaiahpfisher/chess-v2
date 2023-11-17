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
export const WHITE = "white";
export const BLACK = "black";
export const EMPTY_COLOR = "empty-color";
export const PAWN = "pawn";
export const KNIGHT = "knight";
export const BISHOP = "bishop";
export const ROOK = "rook";
export const QUEEN = "queen";
export const KING = "king";
export const EMPTY = "empty";
export const WHITE_DIRECTION = 1;
export const BLACK_DIRECTION = -1;

/**
 * Represents the chessboard in a chess game.
 */
export class Board {
  grid = [];

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
    this.grid[1][0] = new Pawn(WHITE, 1, 0);
    this.grid[1][1] = new Pawn(WHITE, 1, 1);
    this.grid[1][2] = new Pawn(WHITE, 1, 2);
    this.grid[1][3] = new Pawn(WHITE, 1, 3);
    this.grid[1][4] = new Pawn(WHITE, 1, 4);
    this.grid[1][5] = new Pawn(WHITE, 1, 5);
    this.grid[1][6] = new Pawn(WHITE, 1, 6);
    this.grid[1][7] = new Pawn(WHITE, 1, 7);

    // empty middle rows
    for (let row = 2; row < NUM_ROWS - 2; row++) {
      this.grid[row] = [];
      for (let col = 0; col < NUM_COLS; col++) {
        this.grid[row][col] = new Empty(row, col);
      }
    }

    // black second row
    this.grid[6] = [];
    this.grid[6][0] = new Pawn(BLACK, 6, 0);
    this.grid[6][1] = new Pawn(BLACK, 6, 1);
    this.grid[6][2] = new Pawn(BLACK, 6, 2);
    this.grid[6][3] = new Pawn(BLACK, 6, 3);
    this.grid[6][4] = new Pawn(BLACK, 6, 4);
    this.grid[6][5] = new Pawn(BLACK, 6, 5);
    this.grid[6][6] = new Pawn(BLACK, 6, 6);
    this.grid[6][7] = new Pawn(BLACK, 6, 7);

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
   * @param {string} originId - id of starting space (e.g. A2 or H8)
   * @param {string} destId - id of ending space (e.g. A2 or H8)
   * @returns {boolean}
   */
  isValidMove(originId, destId) {
    let valid = true;

    // general checks (e.g. moved on top of own piece)

    // piece-specific checks
    if (
      !document
        .getElementById(originId)
        .piece.isValidMove(this.grid, originId, destId)
    ) {
      valid = false;
    }

    return valid;
  }
}
