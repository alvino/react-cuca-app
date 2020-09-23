import React, { useRef, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";

import api from "../services/api";
import { login } from "../services/auth";

import logo from "../assert/logo_cuca.svg";

const Flutter = styled.div`
  position: relative;
  margin: 100px auto;
`;

export default () => {
  const history = useHistory();
  const location = useLocation();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const handleLogin = useCallback(async () => {
    try {
      const response = await api.get("/login", {
        auth: {
          username: emailInputRef.current.value,
          password: passwordInputRef.current.value,
        },
      });
      login(response.data.token);
    } catch (error) {
      console.error(error);
      toast.error("Usuario ou sanha invalidos");
      return;
    }

    history.goBack();
  }, [history]);

  return (
    <Flutter className="w-25 shadow p-5 bg-primary text-white rounded">
      <img className="mb-4 m-auto d-block" src={logo} alt="" height="72" />
      <h1 className="h3 mb-3 font-weight-normal">Login</h1>

      <input
        type="text"
        id="inputEmail"
        className="form-control my-1"
        placeholder="Usuario"
        ref={emailInputRef}
        required=""
        autoFocus
      />

      <input
        type="password"
        id="inputPassword"
        className="form-control my-1"
        ref={passwordInputRef}
        placeholder="Senha"
        required=""
      />

      <button
        className="btn btn-outline-light btn-block my-1"
        onClick={handleLogin}
      >
        Logar
      </button>
    </Flutter>
  );
};
