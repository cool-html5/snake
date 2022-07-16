import React from "react"
import ReactDOM from "react-dom/client"
import {Game} from "./game"
import "../index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Game horizontalCells={30} verticalCells={20} />
	</React.StrictMode>
)
