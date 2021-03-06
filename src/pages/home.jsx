import React from "react";
import {
  FaUser,
  FaTruck,
  FaWarehouse,
  FaShoppingCart,
  FaClipboardList,
} from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";


// import NavBar from '../components/NavBar'
import Header from "../components/patterns/Header";

import Box from "../components/Box";

export default () => {
  return (
    <div className="mb-5">
      <Header />

      <div className="container-fluid">
        <main className="d-flex justify-content-between  align-items-center">
          <div className="row w-75 mx-auto">
            <Box title="Ponto de Venda" to="/venda">
              <FaShoppingCart />
            </Box>

            <Box title="Orçamentos" to="/orcamento">
              <FaClipboardList />
            </Box>

            <Box title="Estoque" to="/estoque">
              <FaWarehouse />
            </Box>

            <Box title="Clientes" to="/cliente">
              <FaUser />
            </Box>

            <Box title="Fornecedores" to="/fornecedor">
              <FaTruck />
            </Box>

            <Box title="Entrada" to="/entrada">
              <GiReceiveMoney />
            </Box>

            <Box title="Saida" to="/saida">
              <GiPayMoney />
            </Box>

            <Box title="Configuração" to="/configuracao">
              <AiFillSetting />
            </Box>
          </div>
        </main>
      </div>
    </div>
  );
};
