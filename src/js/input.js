document.querySelectorAll(".chessboard .row .cell").forEach(img => {
  img.addEventListener("drop", drop);
  img.addEventListener("dragover", allowDrop);
  img.addEventListener("dragstart", drag);
})

function allowDrop(e) {
  e.preventDefault();
  e.handled = true;
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.closest(".cell").id);
  e.dataTransfer.effectAllowed = "move";
}

function drop(e) {
  e.preventDefault();
  let id = e.dataTransfer.getData("text");
  alert(`Moving from ${id} to ${e.target.closest(".cell").id}`);
}