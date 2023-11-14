document.querySelector(".board").addEventListener("click", makeBlack);

function makeBlack(e) {
  e.target.closest(".cell").classList.add("black");
}