import { Game } from "./classes/Game.js";

document.addEventListener("DOMContentLoaded", main)

function main() {
  const game = new Game();
  game.print();
}