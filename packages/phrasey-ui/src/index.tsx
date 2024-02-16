/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { ThemeMode } from "./core/theme";
import "./index.css";

const root = document.getElementById("root");

render(() => <App />, root!);

ThemeMode.initialize();
