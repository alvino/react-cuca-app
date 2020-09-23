import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getPlaload } from "../services/auth";
import { toast } from 'react-toastify'

export default ({ children, ...rest }) => {
  const plaload = getPlaload();

  if( plaload === null || !plaload.admin ) toast.info('Usuario sem permição.')

  return plaload.admin ? (
    <Route {...rest} >{children}</Route>
  ) : (
    <Redirect to="/" />
  );
};
