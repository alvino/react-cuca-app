import React from "react";
import { FaUserCog } from "react-icons/fa";
import {TiArrowBackOutline} from 'react-icons/ti'

// import NavBar from '../components/NavBar'
import Header from "../../components/patterns/Header";

import Box from "../../components/Box";

export default () => {

  return (
    <div className="mb-5">
      <Header />

      <div className="container-fluid">
        <div></div>
        <main className="d-flex justify-content-between  align-items-center">
          <div className="row w-75 mx-auto">
            <Box title="Voltar" to="/">
              <TiArrowBackOutline />
            </Box>
            <Box title="Usuarios" to="/configuracao/usuario">
              <FaUserCog />
            </Box>
          </div>
        </main>
      </div>
    </div>
  );
};
