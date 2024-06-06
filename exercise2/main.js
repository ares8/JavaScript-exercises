import GameOfLife from "./game.js";
import Controler from "./controler.js";

const game = new GameOfLife();
game.drawBoard();

const controler = new Controler(game);