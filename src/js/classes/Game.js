import { Board } from "./Board.js";

export class Game {
  constructor() {
    this.board = new Board();
  }

  print() {
    this.board.print();
  }
}
