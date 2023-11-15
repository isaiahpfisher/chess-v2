import { Piece } from "../Piece.js";

/**
 * Represents a pawn on a chessboard. 
 * Derived class of Piece.
 */
export class Pawn extends Piece {

  /**
   * @param {string} color - The color of the Pawn (either BLACK or WHITE).
   */
  constructor(color) {
    super();
    this.imgSrc = `./assets/${color}-pawn.svg`;
  }
}