import { Game } from "./classes/Game.js";

// run main when the app loads
document.addEventListener("DOMContentLoaded", main);

// the main driver function for the entire game
function main() {
  const game = new Game();

  document.getElementById("new-game-btn").addEventListener("click", () => {
    newGame(game);
  });

  document
    .getElementById("other-new-game-btn")
    .addEventListener("click", () => {
      newGame(game);
    });
}

/**
 * Creates a new game and resets the game state.
 * @param {Game} game - The current game instance.
 */
function newGame(game) {
  // Hide the game over screen if displayed
  game.hideGameOver();

  // Create a new game instance
  game = new Game();

  // Remove "opacity-25" class from all elements with class "opacity-25"
  document.querySelectorAll(".opacity-25").forEach((f) => {
    f.classList.remove("opacity-25");
  });
}
