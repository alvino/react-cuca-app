import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";


import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";


import Home from './pages/home'
import Client from './pages/cliente'
import Provider from './pages/fornecedor'
import Estoque from './pages/estoque'
import PDV from './pages/venda'


function App() {
	return (
		<>
			<ToastContainer
				position="bottom-right"
				hideProgressBar
				closeOnClick
			/>
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
					<Route path='/pdv'>
						<PDV />
					</Route>
					<Redirect to='/' />
				</Switch>

			</Router>
		</>
	)
}

export default App;




