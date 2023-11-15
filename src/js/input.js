// adds event listeners to every chess piece on the board for drag-and-drop functionality
document.querySelectorAll(".chessboard .row .cell").forEach(img => {
  img.addEventListener("drop", drop);
  img.addEventListener("dragover", dragOver);
  img.addEventListener("dragleave", dragLeave);
  img.addEventListener("dragstart", dragStart);
})

/**
 * Prevents default behavior when a chess piece is dragged over.
 * Runs when a chess piece is dragged over e.target
 * @param {Event} e
 * @returns {void}
 */
function dragOver(e) {
  e.preventDefault();
  // e.target.closest(".cell").classList.add(""); TODO: Add a class here to style spaces when hovered over
}

/**
 * Prevents default behavior when a dragged chess piece leaves a space on the chessboard.
 * Runs when a dragged chess piece leaves a space on the chessboard.
 * @param {Event} e
 * @returns {void}
 */
function dragLeave(e) {
  e.preventDefault();
  // e.target.closest(".cell").remove.add(""); TODO: Remove a class here to style spaces when hovered over
}

/**
 * Associates the id of the origin cell with the dragged element.
 * Runs when an element is first dragged
 * @param {Event} e
 * @returns {void}
 */
function dragStart(e) {
  e.dataTransfer.setData("text", e.target.closest(".cell").id);
  e.dataTransfer.effectAllowed = "move";
}

/**
 * Initiates a new move on the board.
 * Runs when a chess piece is dropped on e.target cell.
 * @param {Event} e
 * @returns {void}
 */
function drop(e) {
  e.preventDefault();
  let id = e.dataTransfer.getData("text");
  alert(`Moving from ${id} to ${e.target.closest(".cell").id}`);
}