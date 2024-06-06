class GameOfLife {
	canvas = document.querySelector("canvas");
	ctx = this.canvas.getContext("2d");
	cellSize = 20;
	liveCells = [];

	constructor() {
		this.rows = this.canvas.height / this.cellSize;
		this.cols = this.canvas.width / this.cellSize;
		this.board = Array.from({ length: this.rows }, () => new Array(this.cols).fill(false));
		this.canvas.addEventListener("click", (e) => this.onCanvasClick(e));
	}

	drawBoard() {
		this.ctx.strokeStyle = '#555';
		this.ctx.lineWidth = 1;

		for (let i = 0; i <= this.cols; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(i * this.cellSize, 0);
			this.ctx.lineTo(i * this.cellSize, this.canvas.height);
			this.ctx.stroke();
		}

		for (let j = 0; j <= this.rows; j++) {
			this.ctx.beginPath();
			this.ctx.moveTo(0, j * this.cellSize);
			this.ctx.lineTo(this.canvas.width, j * this.cellSize);
			this.ctx.stroke();
		}
	}

	fillCell(row, col) {
		this.ctx.fillStyle = this.board[row][col] ? 'black' : 'white';
		this.ctx.fillRect(col * this.cellSize + 1, row * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
	}

	onCanvasClick(e) {
		const row = Math.floor(e.offsetY / this.cellSize);
		const col = Math.floor(e.offsetX / this.cellSize);

		this.board[row][col] = !this.board[row][col];
		this.fillCell(row, col);

		if (this.board[row][col] === true) {
			this.liveCells.push({ row, col });
		} else {
			const cellIdToDelete = this.liveCells.findIndex(cell => cell.row === row && cell.col === col);
			this.liveCells.splice(cellIdToDelete, 1);
		}
	}

	spaceAroundCell(row, col) {
		const points = [];
		const moves = [-1, 0, 1];

		moves.forEach(moveY => {
			moves.forEach(moveX => {
				if (!(moveY === 0 && moveX === 0)) {
					const rowAround = row + moveY;
					const colAround = col + moveX;

					if (rowAround >= 0 && rowAround < this.rows && colAround >= 0 && colAround < this.cols) {
						points.push({ row: rowAround, col: colAround });
					}
				}
			});
		});
		return points;
	}

	findCellsToCheck() {
		const deadCells = [];

		this.liveCells.forEach(cell => {
			this.spaceAroundCell(cell.row, cell.col).forEach(point => {
				if (this.board[point.row][point.col] === false) {
					if (deadCells.findIndex(deadCell => deadCell.row === point.row && deadCell.col === point.col) === -1) {
						deadCells.push(point);
					}
				}
			})
		});
		const cellsToCheck = [...this.liveCells, ...deadCells];
		this.liveCells = [];

		return cellsToCheck;
	}

	findCellsToChange() {
		const cellsToChange = [];
		const cellsToCheck = this.findCellsToCheck();

		cellsToCheck.forEach(cell => {
			const liveCellsAround = this.spaceAroundCell(cell.row, cell.col)
				.map(point => this.board[point.row][point.col])
				.filter(point => point === true);

			const cellValue = this.board[cell.row][cell.col];

			if (cellValue === false && liveCellsAround.length === 3) {
				cellsToChange.push(cell);
				this.liveCells.push(cell);
			}
			else if (cellValue === true && liveCellsAround.length !== 2 && liveCellsAround.length !== 3) {
				cellsToChange.push(cell);
			}
			else if (cellValue === true) {
				this.liveCells.push(cell);
			}
		});

		return cellsToChange;
	}

	changeCells() {
		const cellsToChange = this.findCellsToChange();

		if (cellsToChange.length) {
			cellsToChange.forEach(cell => {
				this.board[cell.row][cell.col] = !this.board[cell.row][cell.col];
				this.fillCell(cell.row, cell.col);
			});
			return true;
		}
		else {
			return false;
		}
	}

	reset() {
		if (this.liveCells.length) {
			this.liveCells.forEach(cell => {
				this.board[cell.row][cell.col] = false;
				this.fillCell(cell.row, cell.col);
			});
			this.liveCells = [];
		}
	}
};

export default GameOfLife;