import { Board } from "./Board.js";

/**
   * Represents a game of chess.
   */
export class Game {

  /**
   * Constructs new instance of Game.
   */
  constructor() {
    this.board = new Board();
  }

  /**
   * Prints all aspects of the game to the screen.
   */
  print() {
    this.board.print();
  }
}
