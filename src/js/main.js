import { Game } from "./classes/Game.js";

// run main when the app loads
document.addEventListener("DOMContentLoaded", main);
document
  .getElementById("theme-picker")
  .addEventListener("click", themePickerHandler);

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

function themePickerHandler(e) {
  let target = e.target.closest("input");
  if (target) {
    let color = target.value.toLowerCase();
    pickTheme(color);

    document
      .getElementById("theme-picker")
      .querySelectorAll("label")
      .forEach((option) => {
        option.classList.remove("ring-2");
      });

    target.closest("label").classList.add("ring-2");
  }
}

function pickTheme(color) {
  document.documentElement.style.setProperty(
    "--primary-50",
    getComputedStyle(document.documentElement).getPropertyValue(`--${color}-50`)
  );
  document.documentElement.style.setProperty(
    "--primary-100",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-100`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-200",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-200`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-300",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-300`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-400",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-400`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-500",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-500`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-600",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-600`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-700",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-700`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-800",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-800`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-900",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-900`
    )
  );
  document.documentElement.style.setProperty(
    "--primary-950",
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${color}-950`
    )
  );
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
