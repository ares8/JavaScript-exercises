import board from "./example.js";
import BouncySimulator from "./simulator.js";
import Controler from "./controler.js";

const game = new BouncySimulator(board);
game.drawBoard();

const controler = new Controler(game);