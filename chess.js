document.querySelector(".board").addEventListener("click", makeYellow);

function makeYellow(e) {
  e.target.closest(".cell").classList.add("yellow");
}