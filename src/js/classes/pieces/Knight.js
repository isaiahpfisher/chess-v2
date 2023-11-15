import { Piece } from "../Piece.js";

/**
 * Represents a knight on a chessboard. 
 * Derived class of Piece.
 */
export class Knight extends Piece {

  /**
   * @param {string} color - The color of the Knight (either BLACK or WHITE).
   */
  constructor(color) {
    super();
    this.imgSrc = `./assets/${color}-knight.svg`;
  }
}