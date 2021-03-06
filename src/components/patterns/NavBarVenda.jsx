import React from "react";
import { Link } from "react-router-dom";

import Logo from "../Logo";

function NavBarVenda(props) {
  return (
    <div className="row p-3 mb-2 bg-primary text-white d-flex justify-content-between align-items-center sticky-top">
      <div>
        <Link to="/" className="text-white">
          <Logo style={{width: "7rem"}} />
        </Link>
        <h3>{props.title}</h3>
      </div>
      {props.children ? (
        <div className="mx-3 d-flex flex-column">
          <h4 className="text-right">Cliente:</h4>
          <h2 className="text-right">{props.children}</h2>
        </div>
      ) : (
        ""
      )}
      <div className="mx-3 d-flex flex-column">
        <h4 className="text-right">Itens:</h4>
        <h2 className="text-right">{props.quantidadeDeItens}</h2>
      </div>
      <div className="mx-3 d-flex flex-column">
        <h4 className="text-right"> Valor total do pedido:</h4>
        <h2 className="text-right">{props.valorTotal}</h2>
      </div>
    </div>
  );
}

export default React.memo(NavBarVenda);
