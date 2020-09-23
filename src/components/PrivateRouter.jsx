import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getPlayload } from "../services/auth";
import { toast } from 'react-toastify'

export default ({ children, ...rest }) => {
  const playload = getPlayload();

  if( playload === null || !playload.admin ) toast.info('Usuario sem permição.')

  return playload.admin ? (
    <Route {...rest} >{children}</Route>
  ) : (
    <Redirect to="/" />
  );
};
