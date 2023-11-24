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
  print(turn) {
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        let cellId = Piece.getA1Notation(row, col);
        document.querySelector(`#${cellId}`).piece = this.grid[row][col];
        document.querySelector(`#${cellId}`).querySelector("img").src =
          this.grid[row][col].imgSrc;

        if (this.grid[row][col].imgSrc != "") {
          document
            .querySelector(`#${cellId}`)
            .querySelector("img")
            .classList.remove("hidden");
        } else {
          document
            .querySelector(`#${cellId}`)
            .querySelector("img")
            .classList.add("hidden");
        }

        document.querySelector(`#${cellId}`).querySelector("img").draggable =
          this.grid[row][col].color == turn;
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
      let undoFunction = this.move(originId, destId, [], true); // simulation = true;
      let stillCheck = this.findKing(turn).isInCheck(this.grid);
      undoFunction();

      // handle error message
      if (stillCheck) {
        validMove = false;
        if (currentCheck) {
          Game.invalidMessage = `${turn}'s king is currently in check. Your next move must remove the check. Please try again.`;
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
   * @param {Array} capturedPieces - Array of captured pieces for graphic
   * @param {boolean} simulation - Indicates whether or not this move is a simulation that will be undone
   * @returns {function} - Returns an undo function to undo the move.
   */
  move(originId, destId, capturedPieces, simulation) {
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
    let undoPieceMove = piece.move(this.grid, originId, destId, simulation);

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

      if (moveSummary.capturedPiece.type != EMPTY) {
        capturedPieces.pop();
      }

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
    if (!simulation) {
      // check if other color in check
      moveSummary.check = this.findKing(
        piece.color == WHITE ? BLACK : WHITE
      ).isInCheck(this.grid);
      Game.moveHistory.unshift(moveSummary);
    }

    return undoFunction;
  }

  /**
   * Find the king of a specific color on the game grid.
   *
   * @param {string} color - The color of the king to find.
   * @returns {Object} - The piece object representing the king.
   */
  findKing(color) {
    // Iterate over each row on the game grid.
    for (let row = 0; row < NUM_ROWS; row++) {
      // Iterate over each column on the game grid.
      for (let col = 0; col < NUM_COLS; col++) {
        // Get the current piece on the grid.
        let piece = this.grid[row][col];

        // Check if the piece is a king and has the specified color.
        if (piece.type == KING && piece.color == color) {
          // Return the piece object representing the king.
          return piece;
        }
      }
    }
  }

  /**
   * Returns a string representation of the grid.
   * @returns {string} The string representation of the grid.
   */
  getStringRepresentation() {
    let str = "";
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        str += this.grid[row][col].type[0]; // Appends the first character of the cell type to the string.
      }
    }
    return str; // Returns the string representation of the grid.
  }

  /**
   * Checks if the current chess position has insufficient material for a checkmate.
   * @returns {boolean} True if the position has insufficient material, otherwise false.
   */
  isInsufficientMaterial() {
    let knights = 0;
    let whiteBishopsOnWhite = 0;
    let whiteBishopsOnBlack = 0;
    let blackBishopsOnWhite = 0;
    let blackBishopsOnBlack = 0;

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        let piece = this.grid[row][col];

        if (piece.type == QUEEN || piece.type == ROOK || piece.type == PAWN) {
          return false; // If a queen, rook, or pawn is found, the position is not insufficient material.
        }
        if (piece.type == KNIGHT) {
          knights++; // Count the number of knights.
        }
        if (piece.type == BISHOP) {
          if ((row + col) % 2 == 0) {
            // If the row and column sum is even, the bishop is on a white square.
            piece.color == WHITE
              ? whiteBishopsOnWhite++
              : blackBishopsOnWhite++; // Increment the respective counter.
          } else {
            // If the row and column sum is odd, the bishop is on a black square.
            piece.color == WHITE
              ? whiteBishopsOnBlack++
              : blackBishopsOnBlack++; // increment the respective counter.
          }
        }
      }
    }

    // Insufficient material condition: just two kings (no knights or bishops)
    if (
      knights +
        whiteBishopsOnWhite +
        whiteBishopsOnBlack +
        blackBishopsOnWhite +
        blackBishopsOnBlack ==
      0
    ) {
      return true;
    }

    // Insufficient material condition: one king and bishop versus one king
    if (
      knights == 0 &&
      ((whiteBishopsOnWhite + whiteBishopsOnBlack == 1 &&
        blackBishopsOnWhite + blackBishopsOnBlack == 0) ||
        (whiteBishopsOnWhite + whiteBishopsOnBlack == 0 &&
          blackBishopsOnWhite + blackBishopsOnBlack == 1))
    ) {
      return true;
    }

    // Insufficient material condition: one king and knight versus one king
    if (
      whiteBishopsOnWhite +
        whiteBishopsOnBlack +
        blackBishopsOnWhite +
        blackBishopsOnBlack ==
        0 &&
      knights == 1
    ) {
      return true;
    }

    // Insufficient material condition: one king and bishop vs one king and bishop (bishops on same color)
    if (
      knights == 0 &&
      ((whiteBishopsOnBlack + blackBishopsOnBlack == 0 &&
        whiteBishopsOnWhite + blackBishopsOnWhite == 2) ||
        (whiteBishopsOnBlack + blackBishopsOnBlack == 2 &&
          whiteBishopsOnWhite + blackBishopsOnWhite == 0))
    ) {
      return true;
    }

    return false; // The position has sufficient material.
  }

  /**
   * Checks if the current player is in checkmate OR stalemate.
   * @param {string} turn - The color of the current player (i.e. WHITE or BLACK).
   * @returns {boolean} True if the current player is in checkmate or stalemate, otherwise false.
   */
  isMate(turn) {
    let currentKing = this.findKing(turn);

    // Check for any possible moves that won't result in the king being under check
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        let piece = this.grid[row][col];
        if (!piece.isEmpty() && piece.color == turn) {
          for (let subRow = 0; subRow < NUM_ROWS; subRow++) {
            for (let subCol = 0; subCol < NUM_COLS; subCol++) {
              let originId = Piece.getA1Notation(row, col);
              let destId = Piece.getA1Notation(subRow, subCol);

              // if a valid move
              if (
                this.isValidMove(
                  turn,
                  Piece.getA1Notation(row, col),
                  Piece.getA1Notation(subRow, subCol)
                )
              ) {
                return false; // return false at first sign of valid move
              }
            }
          }
        }
      }
    }

    return true; // The current player is in checkmate.
  }

  /**
   * Evaluate the score of the current board position for a given color.
   * @param {string} color - The color of the pieces to evaluate.
   * @returns {number} - The score of the board position.
   */
  evaluateBoard(color) {
    // Determine the enemy color
    let enemyColor = color == WHITE ? BLACK : WHITE;

    // Find the current king and enemy king
    let currentKing = this.findKing(color);
    let enemyKing = this.findKing(enemyColor);

    let score = 0;

    // Evaluate the score based on the number of queens
    score +=
      9 *
      (this.countPieces(QUEEN, color) - this.countPieces(QUEEN, enemyColor));

    // Evaluate the score based on the king's check status
    score +=
      4 * (enemyKing.isInCheck(this.grid) - currentKing.isInCheck(this.grid));

    // Evaluate the score based on the number of rooks
    score +=
      5 * (this.countPieces(ROOK, color) - this.countPieces(ROOK, enemyColor));

    // Evaluate the score based on the number of bishops
    score +=
      3 *
      (this.countPieces(BISHOP, color) - this.countPieces(BISHOP, enemyColor));

    // Evaluate the score based on the number of knights
    score +=
      3 *
      (this.countPieces(KNIGHT, color) - this.countPieces(KNIGHT, enemyColor));

    // Evaluate the score based on the number of pawns
    score +=
      1 * (this.countPieces(PAWN, color) - this.countPieces(PAWN, enemyColor));

    // Penalize for blocked pawns
    score -=
      0.5 *
      (this.countBlockedPawns(color) - this.countBlockedPawns(enemyColor));

    // Penalize for isolated pawns
    score -=
      0.5 *
      (this.countIsolatedPawns(color) - this.countIsolatedPawns(enemyColor));

    // Penalize for doubled pawns
    score -=
      0.5 *
      (this.countDoubledPawns(color) - this.countDoubledPawns(enemyColor));

    // Reward for higher number of legal moves
    score +=
      0.1 *
      (this.countTotalLegalMoves(color) -
        this.countTotalLegalMoves(enemyColor));

    return score;
  }

  /**
   * Counts the number of pieces on the grid that match the specified type and color.
   *
   * @param {string} type - The type of the pieces to count.
   * @param {string} color - The color of the pieces to count.
   * @returns {number} - The count of matching pieces.
   */
  countPieces(type, color) {
    let count = 0;

    // Traverse each row and column of the grid
    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        // Check if the current piece matches the specified type and color
        if (
          this.grid[row][col].type == type &&
          this.grid[row][col].color == color
        ) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Counts the number of doubled pawns on the grid for the specified color.
   *
   * @param {string} color - The color of the pawns to count.
   * @returns {number} - The count of doubled pawns.
   */
  countDoubledPawns(color) {
    let totalCount = 0;

    // Traverse each column of the grid
    for (let col = 0; col < NUM_COLS; col++) {
      let count = 0;

      // Traverse each row of the current column
      for (let row = 0; row < NUM_ROWS; row++) {
        // Check if the current piece is a pawn of the specified color
        if (
          this.grid[row][col].type == PAWN &&
          this.grid[row][col].color == color
        ) {
          count++;
        }
      }

      // If there are pawns of the specified color in the current column, add the count to the total count
      if (count > 0) {
        totalCount += count;
      }
    }

    return totalCount;
  }

  /**
   * Counts the number of isolated pawns on the grid for the specified color.
   *
   * @param {string} color - The color of the pawns to count.
   * @returns {number} - The count of isolated pawns.
   */
  countIsolatedPawns(color) {
    let totalCount = 0;

    // Traverse each column of the grid
    for (let col = 0; col < NUM_COLS; col++) {
      let prevCount = 0;
      let currCount = 0;
      let nextCount = 0;

      // Traverse each row of the current column
      for (let row = 0; row < NUM_ROWS; row++) {
        // Check if the previous column has a pawn of the specified color
        if (
          col > 0 &&
          this.grid[row][col - 1].type == PAWN &&
          this.grid[row][col - 1].color == color
        ) {
          prevCount++;
        }

        // Check if the current position has a pawn of the specified color
        if (
          this.grid[row][col].type == PAWN &&
          this.grid[row][col].color == color
        ) {
          currCount++;
        }

        // Check if the next column has a pawn of the specified color
        if (
          col < NUM_COLS - 1 &&
          this.grid[row][col + 1].type == PAWN &&
          this.grid[row][col + 1].color == color
        ) {
          nextCount++;
        }
      }

      // If the current column has isolated pawns of the specified color, add the count to the total count
      if (currCount > 0 && prevCount === 0 && nextCount === 0) {
        totalCount += currCount;
      }
    }

    return totalCount;
  }

  /**
   * Counts the number of blocked pawns on the grid for the specified color.
   *
   * @param {string} color - The color of the pawns to count.
   * @returns {number} - The count of blocked pawns.
   */
  countBlockedPawns(color) {
    let direction = color == WHITE ? WHITE_DIRECTION : BLACK_DIRECTION;
    let enemyColor = color == WHITE ? BLACK : WHITE;
    let totalCount = 0;

    // Traverse each row of the grid
    for (let row = 0; row < NUM_ROWS; row++) {
      let count = 0;

      // Traverse each column of the current row
      for (let col = 0; col < NUM_COLS; col++) {
        // Check if the current position has a pawn of the specified color
        if (
          this.grid[row][col].type == PAWN &&
          this.grid[row][col].color == color
        ) {
          if ((color == WHITE && row == 0) || (color == BLACK && row == 7)) {
            totalCount++;
          } else if (!this.grid[row + direction][col].isEmpty()) {
            if (
              (col == 0 ||
                this.grid[row + direction][col - 1].color != enemyColor) &&
              (col == 7 ||
                this.grid[row + direction][col + 1].color != enemyColor)
            ) {
              totalCount++;
            }
          }
        }
      }
    }

    return totalCount;
  }

  /**
   * Counts the total number of legal moves for a given color.
   *
   * @param {string} color - The color of the pieces to count the legal moves for.
   * @returns {number} - The total number of legal moves.
   */
  countTotalLegalMoves(color) {
    let totalMoves = 0;
    let currentKing = this.findKing(color);

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLS; col++) {
        let piece = this.grid[row][col];

        // Check if the piece is of the specified color
        if (piece.color == color) {
          for (let subRow = 0; subRow < NUM_ROWS; subRow++) {
            for (let subCol = 0; subCol < NUM_COLS; subCol++) {
              let originId = Piece.getA1Notation(row, col);
              let destId = Piece.getA1Notation(subRow, subCol);

              // if the move is valid
              if (this.isValidMove(color, originId, destId)) {
                totalMoves++; // increment legal move count if valid move
              }
            }
          }
        }
      }
    }
    return totalMoves;
  }
}
