import { Game } from "./classes/Game.js";

// run main when the app loads
document.addEventListener("DOMContentLoaded", main);
document.getElementById("new-game-btn").addEventListener("click", newGame);
document
  .getElementById("other-new-game-btn")
  .addEventListener("click", newGame);

// the main driver function for the entire game
function main() {
  const game = new Game();

  document.getElementById("new-game-btn").addEventListener("click", () => {
    game.hideGameOver();
    game = new Game();
  });

  document
    .getElementById("other-new-game-btn")
    .addEventListener("click", () => {
      game.hideGameOver();
      game = new Game();
    });
}
