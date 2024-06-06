class Controler {
	input = document.querySelector("input");
	start = document.querySelector(".start");
	reset = document.querySelector(".reset");
	message = document.querySelector(".message");
	animation;
	gameStatus = "waiting";

	constructor(simulator) {
		this.simulator = simulator;
		this.start.addEventListener("click", () => this.onStartButtonPressed());
		this.reset.addEventListener("click", () => this.onResetButtonPressed());
	}

	onStartButtonPressed() {
		if (this.gameStatus === "waiting") {
			if (this.input.value.trim() === "" || !Number.isInteger(+this.input.value) || +this.input.value < 0) {
				this.message.textContent = "[INPUT POSITIVE INTEGER]";
				this.input.style.backgroundColor = "#aaa";
			}
			else if (+this.input.value > this.simulator.maxCoins) {
				this.message.textContent = `[MAX. ${this.simulator.maxCoins} COINS]`;
				this.input.style.backgroundColor = "#aaa";
			}
			else {
				this.simulator.placeBallAndCoins(this.input.value);
				this.input.style.backgroundColor = "#91b40f";
				this.message.textContent = "";
				this.input.value = "";
				this.input.disabled = true;
				this.start.textContent = "◼ STOP";
				this.gameStatus = "play";

				this.simulator.drawBall();
			}
		}
		else if (this.gameStatus === "play") {
			this.simulator.resetAnimation();
			this.start.textContent = "▶ START";
			this.gameStatus = "stop";
		}
		else {
			this.start.textContent = "◼ STOP";
			this.gameStatus = "play";
			this.simulator.drawBall();
		}
	}

	onResetButtonPressed() {
		if (this.gameStatus === "play") {
			this.simulator.resetAnimation();
			this.start.textContent = "▶ START";
		};

		if (this.gameStatus !== "waiting") {
			this.input.disabled = false;
			this.simulator.resetPanels();
			this.gameStatus = "waiting";
		}
	}
};

export default Controler;