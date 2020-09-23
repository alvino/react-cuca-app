import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Home from "./home";
import Usuario from "./usuario";

export default () => {
  let { path } = useRouteMatch();

  return (
    <>
      <Switch>
        <Route exact path={path}>
          <Home />
        </Route>
        <Route path={`${path}/usuario`}>
          <Usuario />
        </Route>
      </Switch>
    </>
  );
};
