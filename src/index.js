import ReactDOM from "react-dom";
import { HashRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import "./index.css";

const app = document.getElementById("app");
ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  app
);
