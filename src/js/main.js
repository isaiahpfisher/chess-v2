import { Game } from "./classes/Game.js";

// run main when the app loads
document.addEventListener("DOMContentLoaded", main)

// the main driver function for the entire game
function main() {
  const game = new Game();
  game.print();
}