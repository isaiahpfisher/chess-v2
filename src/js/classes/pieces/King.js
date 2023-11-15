import { Piece } from "../Piece.js";

/**
 * Represents a king on a chessboard. 
 * Derived class of Piece.
 */
export class King extends Piece {

  /**
   * @param {string} color - The color of the King (either BLACK or WHITE).
   */
  constructor(color) {
    super();
    this.imgSrc = `./assets/${color}-king.svg`;
  }
}