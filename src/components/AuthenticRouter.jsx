import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

export default ({ children, ...rest }) => {
  const isAuthentic = isAuthenticated();

  console.log(isAuthentic);
  return isAuthentic ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Redirect to="/login" />
  );
};
