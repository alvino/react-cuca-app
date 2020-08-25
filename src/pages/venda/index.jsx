import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";


import PontoDeVenda from './pontodevenda'
import FechamentoDeVenda from './fechamentodevenda'

export default () => {

  let { path } = useRouteMatch();

  return (

    <Switch>
      <Route exact path={path}>
        <PontoDeVenda />
      </Route>
      <Route exact path={`${path}/fechamentodevenda/:id`}>
        <FechamentoDeVenda />
      </Route>
    </Switch>

  )
}

