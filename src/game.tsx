import {useEffect, useRef, useState} from "react"
import {useEventListener} from "./hooks/use-event-listener"
import {Panel} from "./panel"
import {SnakeCell} from "./snake-cell"
import {ButtonStates, GameStats} from "./types"

const cellWidth = 20
const cellHeight = 20
const initialIntervalInMs = 250

type Props = {
	horizontalCells: number
	verticalCells: number
}

export const Game = (props: Props) => {
	const {horizontalCells, verticalCells} = props
	const canvasWidth = cellWidth * horizontalCells
	const canvasHeight = cellHeight * verticalCells
	const [gameStats, setGameStats] = useState<GameStats>({score: 0, length: 1, speed: 1000 / initialIntervalInMs})
	const gameStatsRef = useRef(gameStats)
	const [buttonStates, setButtonStates] = useState<ButtonStates>({start: true, pause: false, newGame: false})
	const intervalHandle = useRef<number>()
	const intervalInMs = useRef(initialIntervalInMs)
	const context = useRef<CanvasRenderingContext2D>()
	const snakeCellArray = useRef<SnakeCell[]>([])
	const dx = useRef(0)
	const dy = useRef(0)
	const baitX = useRef(0)
	const baitY = useRef(0)
	const gamePaused = useRef(false)

	const setBait = () => {
		if (context?.current) {
			do {
				baitX.current = Math.round(Math.random() * (horizontalCells - 1) + 1) - 1
				baitY.current = Math.round(Math.random() * (verticalCells - 1) + 1) - 1
			} while (checkBait(baitX.current, baitY.current))
			context.current.fillStyle = "gray"
			context.current.lineWidth = 0.5
			context.current.fillRect(
				baitX.current * cellWidth + 1,
				baitY.current * cellHeight + 1,
				cellWidth - 2.5,
				cellHeight - 2.5
			)
		}
	}

	const checkBait = (x: number, y: number) => {
		const snakeX = snakeCellArray.current[0].getX()
		const snakeY = snakeCellArray.current[0].getY()

		if ((y === snakeY && Math.abs(snakeX - x) < 2) || (x === snakeX && Math.abs(snakeY - y) < 2)) {
			return true
		}

		return checkSnake(x, y)
	}

	const clearBait = () => {
		if (context?.current) {
			context.current.fillStyle = "#FFFFFF"
			context.current.lineWidth = 0.5
			context.current.fillRect(
				baitX.current * cellWidth + 1,
				baitY.current * cellHeight + 1,
				cellWidth - 2,
				cellHeight - 2
			)
		}
	}

	const checkSnake = (cx: number, cy: number) => {
		if (cx < 0 || cy < 0 || cx >= horizontalCells || cy >= verticalCells) {
			return true
		}
		for (let i = 0; i < snakeCellArray.current.length; i++) {
			if (snakeCellArray.current[i].getX() == cx && snakeCellArray.current[i].getY() == cy) {
				return true
			}
		}
		return false
	}

	const startGame = function () {
		setButtonStates({start: false, pause: true, newGame: true})
		intervalHandle.current = setInterval(nextStep, intervalInMs.current)
	}

	const nextStep = function () {
		if (!context?.current) {
			return
		}

		const x = snakeCellArray.current[0].getX() + dx.current
		const y = snakeCellArray.current[0].getY() + dy.current
		if (checkSnake(x, y)) {
			gameOver()
			return
		}

		let newCell = new SnakeCell(x, y, context.current, cellWidth, cellHeight)
		if (baitX.current == x && baitY.current == y) {
			setBait()
			intervalInMs.current -= 2
			clearInterval(intervalHandle.current)
			intervalHandle.current = setInterval(nextStep, intervalInMs.current)
			newCell = new SnakeCell(x, y, context.current, cellWidth, cellHeight)
			snakeCellArray.current.push(newCell)
			const newScore = Math.round(
				gameStatsRef.current.score + snakeCellArray.current.length / 2 + gameStatsRef.current.speed / 2
			)
			setGameStatistics({
				score: newScore,
				length: snakeCellArray.current.length,
				speed: 1000 / intervalInMs.current
			})
			snakeCellArray.current.pop()
		} else {
			snakeCellArray.current.pop()?.erase()
			if (!intervalHandle.current) {
				intervalHandle.current = setInterval(nextStep, intervalInMs.current)
			}
		}
		snakeCellArray.current.unshift(newCell)
		newCell.draw()
	}

	const setGameStatistics = function (stats: GameStats) {
		setGameStats(stats)
		gameStatsRef.current = stats
	}

	const deactivateTimer = function () {
		clearInterval(intervalHandle.current)
		intervalHandle.current = undefined
	}

	const gameOver = function () {
		if (context?.current) {
			setButtonStates({start: false, pause: false, newGame: true})
			deactivateTimer()
			gamePaused.current = false
			context.current.font = "48px Georgia"
			const gradient = context.current.createLinearGradient(0, 0, canvasWidth, 0)
			gradient.addColorStop(0, "magenta")
			gradient.addColorStop(0.5, "blue")
			gradient.addColorStop(1.0, "red")
			context.current.fillStyle = gradient
			context.current.fillText("GAME OVER!", 20, canvasHeight / 2)
		}
	}

	const newGame = function () {
		deactivateTimer()
		intervalInMs.current = initialIntervalInMs
		snakeCellArray.current = []
		drawGrid()
		setGameStatistics({score: 0, length: 1, speed: 1000 / initialIntervalInMs})
		setButtonStates({start: true, pause: false, newGame: false})
		dx.current = 1
		dy.current = 0
		setGameStatistics({score: 0, length: 1, speed: 1000 / initialIntervalInMs})
		clearBait()
		eraseSnake()
		const startX = Math.floor(Math.random() * (horizontalCells - 10 - 1)) + 5
		const startY = Math.floor(Math.random() * (verticalCells - 10 - 1)) + 5
		const newCell = new SnakeCell(startX, startY, context.current!, cellWidth, cellHeight)
		snakeCellArray.current.push(newCell)
		newCell.draw()
		setBait()
	}

	const eraseSnake = () => {
		while (snakeCellArray.current.length) {
			snakeCellArray.current.pop()?.erase()
		}
	}

	const drawGrid = function () {
		if (context?.current) {
			context.current.fillStyle = "#FFFFFF"
			context.current.fillRect(0, 0, canvasWidth, canvasHeight)
			context.current.strokeStyle = "#999999"
			context.current.lineWidth = 0.5

			// Draw vertical lines
			for (let x = cellWidth; x < canvasWidth; x += cellWidth) {
				context.current.beginPath()
				context.current.moveTo(x - 0.5, 0)
				context.current.lineTo(x - 0.5, canvasHeight)
				context.current.stroke()
			}

			// Draw horizontal lines
			for (let y = cellHeight; y < canvasHeight; y += cellHeight) {
				context.current.beginPath()
				context.current.moveTo(0, y - 0.5)
				context.current.lineTo(canvasWidth, y - 0.5)
				context.current.stroke()
			}
		}
	}

	const togglePause = function () {
		if (gamePaused.current) {
			nextStep()
		} else {
			deactivateTimer()
		}

		setButtonStates({start: false, pause: true, newGame: true})
		gamePaused.current = !gamePaused.current
	}

	const keyDownHandler = function (event: KeyboardEvent) {
		const keyCodeArray = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]

		if (keyCodeArray.indexOf(event.code) === -1) {
			return
		}

		event.preventDefault()

		if (!intervalHandle.current && !gamePaused.current) {
			return
		}

		if (event.code === "Space") {
			togglePause()
			return
		}

		if (gamePaused.current) {
			return
		}

		switch (event.code) {
			case "ArrowUp":
				if (dy.current === 0) {
					dx.current = 0
					dy.current = -1
				}
				break
			case "ArrowDown":
				if (dy.current === 0) {
					dx.current = 0
					dy.current = 1
				}
				break
			case "ArrowLeft":
				if (dx.current === 0) {
					dx.current = -1
					dy.current = 0
				}
				break
			case "ArrowRight":
				if (dx.current === 0) {
					dx.current = 1
					dy.current = 0
				}
				break
		}

		deactivateTimer()
		nextStep()
	}

	useEventListener("keydown", keyDownHandler as (event: Event) => void)

	useEffect(() => {
		const canvas = document.getElementById("canvas-snake")! as HTMLCanvasElement
		context.current = canvas.getContext("2d")!
		drawGrid()
		newGame()
	}, [])

	return (
		<div className="ml-24">
			<h1 className="text-3xl font-bold p-6">Snake</h1>
			<Panel
				gameStats={gameStats}
				buttonStates={buttonStates}
				startGame={startGame}
				togglePause={togglePause}
				newGame={newGame}
				gamePaused={gamePaused.current}
			/>
			<div className="flex flex-row my-5 mx-8">
				<canvas
					id="canvas-snake"
					width={canvasWidth}
					height={canvasHeight}
					className="border-2 border-slate-300"
				></canvas>
			</div>
		</div>
	)
}
