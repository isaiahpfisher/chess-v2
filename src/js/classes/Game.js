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
    this.setupDragDrop();
  }

  /**
   * Prints all aspects of the game to the screen.
   */
  print() {
    this.board.print();
  }

  /**
   * Adds event listeners to every chess piece on the board for drag-and-drop functionality.
   * @returns {void}
   */
  setupDragDrop() {
    document.querySelectorAll(".chessboard .row .cell").forEach(img => {
      let newImg = img.cloneNode(true);
      img.parentNode.replaceChild(newImg, img);

      newImg.addEventListener("drop", this.dropPiece);
      newImg.addEventListener("dragover", this.dragOverSpace);
      newImg.addEventListener("dragleave", this.dragLeaveSpace);
      newImg.addEventListener("dragstart", this.dragPieceStart);
    });
  }

  /**
   * Prevents default behavior when a chess piece is dragged over.
   * Runs when a chess piece is dragged over e.target
   * @param {Event} e
   * @returns {void}
   */
  dragOverSpace (e) {
    e.preventDefault();
    // e.target.closest(".cell").classList.add(""); TODO: Add a class here to style spaces when hovered over
  }

  /**
   * Prevents default behavior when a dragged chess piece leaves a space on the chessboard.
   * Runs when a dragged chess piece leaves a space on the chessboard.
   * @param {Event} e
   * @returns {void}
   */
  dragLeaveSpace(e) {
    e.preventDefault();
    // e.target.closest(".cell").remove.add(""); TODO: Remove a class here to style spaces when hovered over
  }

  /**
   * Associates the id of the origin cell with the dragged element.
   * Runs when an element is first dragged
   * @param {Event} e
   * @returns {void}
   */
  dragPieceStart(e) {
    e.dataTransfer.setData("text", e.target.closest(".cell").id);
    e.dataTransfer.effectAllowed = "move";
  }

  /**
   * Initiates a new move on the board.
   * Runs when a chess piece is dropped on e.target cell.
   * @param {Event} e
   * @returns {void}
   */
  dropPiece = (e) => { // weird syntax so that this references the Game instance
    e.preventDefault();
    let originId = e.dataTransfer.getData("text");
    let destId = e.target.closest(".cell").id;
    if (this.board.isValidMove(originId, destId)) {
      // this.board.move();
    }
  }
}