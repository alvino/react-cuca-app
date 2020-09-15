import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/App.scss";


import Home from './pages/home'
import Client from './pages/cliente'
import Provider from './pages/fornecedor'
import Estoque from './pages/estoque'
import Orcamento from './pages/orcamento'
import Venda from './pages/venda'
import Entrada from './pages/entrada'
import Saida from './pages/saida'


function App() {
	return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar closeOnClick />
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/cliente">
            <Client />
          </Route>
          <Route path="/fornecedor">
            <Provider />
          </Route>
          <Route path="/estoque">
            <Estoque />
          </Route>
          <Route path="/orcamento">
            <Orcamento />
          </Route>
          <Route path="/venda">
            <Venda />
          </Route>
          <Route path="/entrada">
            <Entrada />
          </Route>
          <Route path="/saida">
            <Saida />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>

    </>
  );
}

export default App;




