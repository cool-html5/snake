const snakeColor = "greenyellow"

export class SnakeCell {
	x: number
	y: number
	context: CanvasRenderingContext2D
	cellWidth: number
	cellHeight: number

	constructor(x: number, y: number, context: CanvasRenderingContext2D, cellWidth: number, cellHeight: number) {
		this.x = x
		this.y = y
		this.context = context
		this.cellWidth = cellWidth
		this.cellHeight = cellHeight
	}

	orientation = 0
	fullRows = 0

	draw() {
		this.context.fillStyle = snakeColor
		this.context.lineWidth = 0.5
		this.context.fillRect(
			this.x * this.cellWidth + 1,
			this.y * this.cellHeight + 1,
			this.cellWidth - 2.5,
			this.cellHeight - 2.5
		)
	}

	erase() {
		this.context.fillStyle = "#FFFFFF"
		this.context.lineWidth = 0.5
		this.context.fillRect(
			this.x * this.cellWidth + 1,
			this.y * this.cellHeight + 1,
			this.cellWidth - 2,
			this.cellHeight - 2
		)
	}

	getX() {
		return this.x
	}

	getY() {
		return this.y
	}
}
