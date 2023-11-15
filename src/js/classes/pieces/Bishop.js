import { Piece } from "../Piece.js";

/**
 * Represents a bishop on a chessboard. 
 * Derived class of Piece.
 */
export class Bishop extends Piece {

  /**
   * @param {string} color - The color of the Bishop (either BLACK or WHITE).
   */
  constructor(color) {
    super();
    this.imgSrc = `./assets/${color}-bishop.svg`; // Set the image source for the Bishop based on its color
  }
}
