import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";


import NavBar from '../../components/NavBar'
import Home from './home'
import Register from './register'
import Delete from './delete'
import Print from './print'

export default () => {

  let { path } = useRouteMatch();

  return (

    <>
      <NavBar />

      <div className='container-fluid'>
        <main>
          <Switch>
            <Route exact path={path}>
              <Home />
            </Route>
            <Route exact path={`${path}/register`}>
              <Register />
            </Route>
            <Route exact path={`${path}/print`}>
              <Print />
            </Route>
            <Route exact path={`${path}/delete/:id`}>
              <Delete />
            </Route>
          </Switch>
        </main>
      </div>
    </>
  )
}
