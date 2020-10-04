import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";



import NavBar from '../../components/NavBar'
import Home from './home'
import ClientRegister from './register'
import ClientDelete from './delete'
import Print from './print'

export default () => {

  let { path } = useRouteMatch();

  return (
    <div>
      <NavBar />

      <div className="container-fluid">
        <main>
          <Switch>
            <Route exact path={path}>
              <Home />
            </Route>
            <Route exact path={`${path}/register`}>
              <ClientRegister />
            </Route>
            <Route exact path={`${path}/register/:id`}>
              <ClientRegister />
            </Route>
            <Route exact path={`${path}/delete/:id`}>
              <ClientDelete />
            </Route>
            <Route path={`${path}/print`}>
              <Print />
            </Route>
          </Switch>
        </main>
      </div>

    </div>
  );
}
