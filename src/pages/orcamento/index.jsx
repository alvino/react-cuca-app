import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import Footer from "../../components/patterns/Footer";
import NavBar from '../../components/NavBar'
import Home from './home'
import Print from './print'
import Delete from './delete'

export default () => {

  let { path } = useRouteMatch();

  return (

    <div>
      <NavBar />

      <div className='container-fluid'>
        <main>
          <Switch>
            <Route exact path={path}>
              <Home />
            </Route>
            <Route exact path={`${path}/print/:id`}>
              <Print />
            </Route>
            <Route exact path={`${path}/delete/:id`}>
              <Delete />
            </Route>
          </Switch>
        </main>
      </div> 

      <Footer />
    </div>
  )
}
