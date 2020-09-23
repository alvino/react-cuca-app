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

import AuthenticRoute from './components/AuthenticRouter'
import PrivateRouter from "./components/PrivateRouter";


import Home from './pages/home'
import Login from './pages/login'
import Client from './pages/cliente'
import Provider from './pages/fornecedor'
import Estoque from './pages/estoque'
import Orcamento from './pages/orcamento'
import Venda from './pages/venda'
import Entrada from './pages/entrada'
import Saida from './pages/saida'
import Sobre from './pages/sobre'
import Configuracao from './pages/configuracao'



function App() {

	return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar closeOnClick />
      <Router>
        <Switch>
          <Route path="/login" exact>
            <Login />
          </Route>

          <AuthenticRoute path="/" exact>
            <Home />
          </AuthenticRoute>
          <AuthenticRoute path="/cliente">
            <Client />
          </AuthenticRoute>
          <AuthenticRoute path="/fornecedor">
            <Provider />
          </AuthenticRoute>
          <AuthenticRoute path="/estoque">
            <Estoque />
          </AuthenticRoute>
          <AuthenticRoute path="/orcamento">
            <Orcamento />
          </AuthenticRoute>
          <AuthenticRoute path="/venda">
            <Venda />
          </AuthenticRoute>
          <AuthenticRoute path="/entrada">
            <Entrada />
          </AuthenticRoute>
          <AuthenticRoute path="/saida">
            <Saida />
          </AuthenticRoute>
          <AuthenticRoute path="/sobre">
            <Sobre />
          </AuthenticRoute>
          <PrivateRouter path="/configuracao">
            <Configuracao />
          </PrivateRouter>

          <Redirect to="/" />
        </Switch>
      </Router>
    </>
  );
}

export default App;




