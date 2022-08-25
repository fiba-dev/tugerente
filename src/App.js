import "./App.css";
import { Dropdowns } from "./components/combobox";
import React from "react";

function App() {
	return (
		<div className="App">
			<a href={"https://www.tugerente.com/"} target="_blank" rel="noreferrer">
				<img
					loading="lazy"
					src="https://uploads-ssl.webflow.com/61ad577c8c5e55e9e73323c6/61b160c2ced168a846469ba6_Logo_tuGerente_marcaregistrada_rojo-2-300x85.png"
					alt=""
				/>
			</a>
			<Dropdowns></Dropdowns>
		</div>
	);
}

export default App;
