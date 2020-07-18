import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
	Link,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";


import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";


import Header from "./components/Header";
// import Footer from "./components/Footer";

import Client from './pages/cliente'
import ClientRegister from './pages/cliente/register'
import ClientDelete from './pages/cliente/delete'

import Provider from './pages/fornecedor'
import ProviderRegister from './pages/fornecedor/register'


function App() {
	return (
		<>
			<ToastContainer ></ToastContainer>
			<Router>
				<div>
					<Header>
						<li className="nav-item">
							<Link className="nav-link" to="/cliente">Cliente</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/fornecedor">Fornecedor</Link>
						</li>
					</Header>

					<div className='container-fluid'>
						<main>
							<Switch>
								<Route exact path="/">
									<></>
								</Route>

								<Route exact path="/cliente">
									<Client />
								</Route>
								<Route exact path="/cliente/register">
									<ClientRegister />
								</Route>
								<Route exact path="/cliente/register/:id">
									<ClientRegister />
								</Route>
								<Route exact path="/cliente/delete/:id">
									<ClientDelete />
								</Route>

								<Route exact path="/fornecedor">
									<Provider />
								</Route>
								<Route path="/fornecedor/register">
									<ProviderRegister />
								</Route>

								<Route exact path="/produto">
									<Client />
								</Route>
								<Route path="/produto/register">
									<ClientRegister />
								</Route>


								<Redirect to='/' />
							</Switch>
						</main>
					</div>


				</div>
			</Router>
		</>
	)
}

export default App;




