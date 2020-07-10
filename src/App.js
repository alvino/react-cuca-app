import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import './sass/photon.scss'

function App() {
	return (
		<Router>
			<div class="window">
				<header className="toolbar toolbar-header">
					<h1 className="title">Photon</h1>

					<div class="toolbar-actions">
						<div class="btn-group">
							<button class="btn btn-default">
								<span class="icon icon-home"></span>
							</button>
							<button class="btn btn-default">
								<span class="icon icon-folder"></span>
							</button>
							<button class="btn btn-default active">
								<span class="icon icon-cloud"></span>
							</button>
							<button class="btn btn-default">
								<span class="icon icon-popup"></span>
							</button>
							<button class="btn btn-default">
								<span class="icon icon-shuffle"></span>
							</button>
						</div>

						<button class="btn btn-default">
							<span class="icon icon-home icon-text"></span>
						Filters
						</button>

						<button class="btn btn-default btn-dropdown pull-right">
							<span class="icon icon-megaphone"></span>
						</button>
					</div>
				</header>

				<div className="window-content">
					<div className="pane-group">
						<div className="pane pane-sm sidebar">
							<nav className="nav-group">
								<h5 className="nav-group-title">Favorites</h5>
								<Link to="/" className="nav-group-item">
									<span className="icon icon-home"></span>
								connors
							</Link>
								<Link to="/about" className="nav-group-item active">
									<span className="icon icon-light-up"></span>
								Photon
							</Link>
								<span className="nav-group-item">
									<span className="icon icon-download"></span>
								Downloads
							</span>
								<span className="nav-group-item">
									<span className="icon icon-folder"></span>
								Documents
							</span>
								<span className="nav-group-item">
									<span className="icon icon-window"></span>
								Applications
							</span>
								<span className="nav-group-item">
									<span className="icon icon-signal"></span>
								AirDrop
							</span>
								<span className="nav-group-item">
									<span className="icon icon-monitor"></span>
								Desktop
							</span>
							</nav>
						</div>

						<div className="pane">
							<Switch>
								<Route exact path="/">
									<Table />
								</Route>
								<Route path="/about">
									<></>
								</Route>
								<Route path="/dashboard">
									<></>
								</Route>
							</Switch>
						</div>
					</div>
				</div>
			</div>
		</Router>
	)
}

function Table() {
	return (
		<table className="table-striped">
			<thead>
				<tr>
					<th>Name</th>
					<th>Kind</th>
					<th>Date Modified</th>
					<th>Author</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>bars.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>base.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>button-groups.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>buttons.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>docs.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>forms.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>grid.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>icons.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>images.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>lists.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>mixins.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>navs.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>normalize.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>photon.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>tables.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>tabs.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>utilities.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
				<tr>
					<td>variables.scss</td>
					<td>Document</td>
					<td>Oct 13, 2015</td>
					<td>connors</td>
				</tr>
			</tbody>
		</table>
	)
}

export default App;




