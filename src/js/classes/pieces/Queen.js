import { Piece } from "../Piece.js";

/**
 * Represents a queen on a chessboard. 
 * Derived class of Piece.
 */
export class Queen extends Piece {

  /**
   * @param {string} color - The color of the Queen (either BLACK or WHITE).
   */
  constructor(color) {
    super();
    this.imgSrc = `./assets/${color}-queen.svg`;
  }
}