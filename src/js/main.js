document.querySelectorAll(".chessboard .row .cell").forEach(img => {
  img.addEventListener("drop", drop);
  img.addEventListener("dragover", allowDrop);
  img.addEventListener("dragstart", drag);
})

function allowDrop(ev) {
  ev.preventDefault();
  ev.handled = true;
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.closest(".cell").id);
}

function drop(ev) {
  ev.preventDefault();
  let id = ev.dataTransfer.getData("text");
  let src = document.getElementById(id).querySelector("img").src;
  document.getElementById(id).querySelector("img").src = "";
  ev.target.querySelector("img").src = src;
}