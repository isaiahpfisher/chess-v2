import { Piece } from "../Piece.js";

/**
 * Represents an empty space on a chessboard. 
 * Derived class of Piece.
 */
export class Empty extends Piece {
  /**
   * Empty pieces have a blank imgSrc, so they will be hidden by some CSS
   */
  constructor() {
    super();
    this.imgSrc = "";
  }
}