import React from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';
import Navbar from "./Navbar";
import Home from "./Pages/Home";
import Edit from "./Pages/Edit";

const App = () => {
	return (
		<div id="App">	
			<BrowserRouter>
				<Navbar></Navbar>
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route path="/edit" element={<Edit/>} />
					{/* <Route path="*" element={<NotFound/>} /> */}
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
