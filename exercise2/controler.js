class Controler {
	start = document.querySelector(".start");
	next = document.querySelector(".next");
	reset = document.querySelector(".reset");
	roundDisplay = document.querySelector(".round");
	speedScale = document.querySelector("input");
	animation;
	round = 0;
	gameStatus = "waiting";

	constructor(game) {
		this.game = game;
		this.start.addEventListener("click", () => this.onStartButtonPressed());
		this.next.addEventListener("click", () => this.onNextButtonPressed());
		this.reset.addEventListener("click", () => this.onResetButtonPressed());
		this.speedScale.addEventListener("change", () => this.onSpeedChange());
	}

	changeCellsAndInfo() {
		const isCellsToChange = this.game.changeCells();

		if (isCellsToChange) {
			this.round += 1;
			this.roundDisplay.textContent = `ROUND: ${this.round}`;
		} else {
			this.start.textContent = "▶ START";
			this.gameStatus = "stop";
			this.round = 0;
			clearInterval(this.animation);
		}
	}

	onStartButtonPressed() {
		if (this.game.liveCells.length) {
			if (this.gameStatus !== "play") {
				this.start.textContent = "◼ STOP";
				this.gameStatus = "play";

				this.animation = setInterval(() => {
					this.changeCellsAndInfo();
				}, 1000 / this.speedScale.value);
			} else {
				this.start.textContent = "▶ START";
				this.gameStatus = "stop";
				clearInterval(this.animation);
			}
		}
	}

	onNextButtonPressed() {
		if (this.game.liveCells.length) {
			this.gameStatus === "waiting" && (this.gameStatus = "stop");
			this.changeCellsAndInfo();
			this.game.liveCells.length === 0 && (this.round = 0);
		}
	}

	onResetButtonPressed() {
		if (this.gameStatus === "play") {
			this.start.textContent = "▶ START";
			clearInterval(this.animation);
		}

		if (this.gameStatus !== "waiting") {
			this.round = 0;
			this.roundDisplay.textContent = "ROUND: 0";
			this.gameStatus = "waiting";
		}

		this.game.reset();
		this.speedScale.value = 1;
	}

	onSpeedChange() {
		if (this.gameStatus === "play") {
			clearInterval(this.animation);

			this.animation = setInterval(() => {
				this.changeCellsAndInfo()
			}, 1000 / this.speedScale.value);
		}
	}
};

export default Controler;