import { Piece } from "../Piece.js";

/**
 * Represents a rook on a chessboard. 
 * Derived class of Piece.
 */
export class Rook extends Piece {

  /**
   * @param {string} color - The color of the Rook (either BLACK or WHITE).
   */
  constructor(color) {
    super();
    this.imgSrc = `./assets/${color}-rook.svg`;
  }
}