class BouncySimulator {
	canvas = document.querySelector("canvas");
	ctx = this.canvas.getContext("2d");
	panelSize = 50;
	emptyPanels = [];
	panelsToReset = [];
	maxCoins;
	ball = {
		x: 0,
		y: 0,
		dirX: 1,
		dirY: 1,
	}
	animationId;

	constructor(board) {
		if (!Array.isArray(board)) {
			throw new Error("The input must be an array");
		}
		this.board = board;
		this.canvas.width = this.board[0].length * this.panelSize;
		this.canvas.height = this.board.length * this.panelSize;
		[this.ballImage, this.elX, this.elY] = this.createImages("ball", "elX", "elY");
	}

	createImages(...names) {
		const images = [];

		names.forEach(name => {
			const image = new Image();
			image.src = `./img/${name}.png`;
			images.push(image);
		});
		return images;
	}

	emptySpaceforBall(row, col) {
		const points = [];
		const moves = [-1, 0, 1];

		moves.forEach(moveY => {
			moves.forEach(moveX => {
				if (!(moveY === 0 && moveX === 0)) {
					points.push({ row: row + moveY, col: col + moveX });
				}
			});
		});
		return points;
	}

	drawBoard() {
		for (let row = 0; row < this.board.length; row++) {
			for (let col = 0; col < this.board[row].length; col++) {

				if (this.board[row][col] === "X") {
					this.elX.addEventListener("load", () => this.ctx.drawImage(this.elX, col * this.panelSize, row * this.panelSize));
				} else {
					this.emptyPanels.push({ row, col });
				}
			}
		}
		this.maxCoins = this.emptyPanels.length - 9;
	}

	placeBallAndCoins(coins) {
		const availablePanels = [...this.emptyPanels];

		for (let i = 0; i <= coins; i++) {
			const panelId = Math.floor(Math.random() * availablePanels.length);

			const row = availablePanels[panelId].row;
			const col = availablePanels[panelId].col;
			availablePanels.splice(panelId, 1);

			if (i === 0) {
				this.ball.x = col * 50;
				this.ball.y = row * 50;

				this.emptySpaceforBall(row, col).forEach(point => {
					const index = availablePanels.findIndex(panel => panel.row === point.row && panel.col === point.col);
					index !== -1 && availablePanels.splice(index, 1);
				})
			} else {
				this.board[row][col] = "Y";
				this.ctx.drawImage(this.elY, col * this.panelSize, row * this.panelSize);
				this.panelsToReset.push({ row, col });
			}
		}
	}

	randomDirection() {
		if (Math.random() > 0.5) {
			this.ball.dirX = this.ball.dirX * (-1);
		} else {
			this.ball.dirY = this.ball.dirY * (-1);
		}
	}

	deleteCoin(panel) {
		this.board[panel.row][panel.col] = "0";
		this.ctx.clearRect(panel.col * 50, panel.row * 50, this.panelSize, this.panelSize);
	}

	resetPanels() {
		this.ctx.clearRect(this.ball.x, this.ball.y, this.panelSize, this.panelSize);
		this.panelsToReset.forEach(panel => this.deleteCoin(panel));
	}

	checkCollisions(row, col) {
		const cornerCollision = {
			row: row + this.ball.dirY,
			col: col + this.ball.dirX
		};
		const verticalCollision = {
			row: row,
			col: col + this.ball.dirX
		}
		const horizontalCollision = {
			row: row + this.ball.dirY,
			col: col
		}

		let collisions = [cornerCollision, verticalCollision, horizontalCollision];

		collisions = collisions.map(panel => this.board[panel.row][panel.col] === "0" ? false : panel);
		collisions.every(panel => panel === false) && (collisions = false);

		return collisions;
	}

	changeDirection(collisions) {
		const [corner, vertical, horizontal] = collisions;

		if (corner && !vertical && !horizontal) {
			this.randomDirection();
			this.board[corner.row][corner.col] === "Y" && this.deleteCoin(corner);
		}
		else {
			if (vertical) {
				this.ball.dirX *= (-1);
				this.board[vertical.row][vertical.col] === "Y" && this.deleteCoin(vertical);
			}
			if (horizontal) {
				this.ball.dirY *= (-1)
				this.board[horizontal.row][horizontal.col] === "Y" && this.deleteCoin(horizontal);
			};
		}
	}

	drawBall() {
		this.ctx.clearRect(this.ball.x, this.ball.y, this.panelSize, this.panelSize);

		if (this.ball.x % this.panelSize === 0 && this.ball.y % this.panelSize === 0) {
			const row = this.ball.y / this.panelSize;
			const col = this.ball.x / this.panelSize;

			let collisions;

			do {
				collisions && this.changeDirection(collisions);
				collisions = this.checkCollisions(row, col);
			}
			while (collisions);
		}

		this.ball.x += 2.5 * this.ball.dirX;
		this.ball.y += 2.5 * this.ball.dirY;

		this.ctx.drawImage(this.ballImage, this.ball.x, this.ball.y);
		this.animationId = requestAnimationFrame(this.drawBall.bind(this));
	}

	resetAnimation() {
		cancelAnimationFrame(this.animationId);
	}
};

export default BouncySimulator;