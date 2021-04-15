import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Scratch from "./components/Scratch";
import { Provider } from "react-redux";
import store from "./reducers";
import "./styles/index.scss";
import "leaflet/dist/leaflet.css"; //regular leaflet
import reportWebVitals from "./reportWebVitals";

const useScratch = true;

ReactDOM.render(
	<Provider store={store}>{useScratch ? <Scratch /> : <App />}</Provider>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
