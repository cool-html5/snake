import {ButtonStates, GameStats} from "./types"

type Props = {
	gameStats: GameStats
	buttonStates: ButtonStates
	startGame: () => void
	togglePause: () => void
	newGame: () => void
	gamePaused: boolean
}

export const Panel = (props: Props) => {
	const {gameStats, buttonStates, startGame, togglePause, newGame, gamePaused} = props

	return (
		<div className="flex flex-row">
			<div className="flex flex-row w-80 ml-6 rounded-xl border-2 border-slate-300 cursor-default">
				<button
					disabled={!buttonStates.start}
					onClick={startGame}
					className="flex-initial w-24 px-5 py-2 border-r-2 rounded-l-lg hover:bg-slate-200 disabled:text-gray-400"
				>
					Start
				</button>
				<button
					disabled={!buttonStates.pause}
					onClick={togglePause}
					className="flex-initial w-24 px-5 py-2 border-r-2 hover:bg-slate-200 disabled:text-gray-400"
				>
					{gamePaused ? "Resume" : "Pause"}
				</button>
				<button
					disabled={!buttonStates.newGame}
					onClick={newGame}
					className="flex-initial grow px-5 py-2 rounded-r-lg hover:bg-slate-200 disabled:text-gray-400"
				>
					New game
				</button>
			</div>
			<div className="flex flex-row w-40 ml-6 rounded-xl border-2 border-slate-300 cursor-default">
				<div className="flex-initial px-5 py-2 border-r-2 rounded-l-lg bg-slate-200">Score</div>
				<div className="flex-initial grow pl-3 py-2 rounded-r-xl">{gameStats.score}</div>
			</div>
			<div className="flex flex-row w-36 ml-6 rounded-xl border-2 border-slate-300 cursor-default">
				<div className="flex-initial px-5 py-2 border-r-2 rounded-l-lg bg-slate-200">Length</div>
				<div className="flex-initial grow px-3 py-2 rounded-r-xl">{gameStats.length}</div>
			</div>
			<div className="flex flex-row w-36 ml-6 rounded-xl border-2 border-slate-300 cursor-default">
				<div className="flex-initial px-5 py-2 border-r-2 rounded-l-lg bg-slate-200">Speed</div>
				<div className="flex-initial grow px-3 py-2 rounded-r-xl">{gameStats.speed.toFixed(2)}</div>
			</div>
		</div>
	)
}
