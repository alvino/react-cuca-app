import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { TableHeaderColumn } from "react-bootstrap-table";

import api from "../../services/api";
import ModalCenterBootstrapTable from "../../components/patterns/ModalCenterBootstrapTable";
import InputFormControl from "../../components/InputFormControl";
import NumberFormat from "../../components/NumberFormat";
import NavBarVenda from "../../components/patterns/NavBarVenda";
import { toast } from "react-toastify";


export default () => {
  const history = useHistory();

  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState({});

  const [data, setData] = useState();

  useEffect(() => {
    setData(new Date().toISOString().substring(0, 10));
  }, []);

 
  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/client");
      setClientes(response.data.clients);
    }
    fetchData();
  }, []);


  const handleSelectedCliente = useCallback((row) => {
    setSelectedCliente(row);
  }, []);

  
  

  const handleRegistraPedido = useCallback(async () => {
    const orcamento = {
      client_id: selectedCliente.id,
      amount: 0,
      created_at: data,
    };
    console.log(orcamento)
    const response = await api.post(`budget`, orcamento);

    if(response.status > 500) toast.error("Erro ao criar pedido")


    history.push(`/venda/${response.data.id}`);
  }, [data, history, selectedCliente.id]);

 

  return (
    <div className="container-fluid">
      <NavBarVenda
        title="Ponto de Venda"
        quantidadeDeItens={0}
        valorTotal={<NumberFormat value={0} />}
      />

      <div className="row">
        <div className="col-4">
          <InputFormControl
            label="Cliente"
            id="inputCliente"
            name="inputCliente"
            value={selectedCliente.name || ""}
            readOnly
          >
            <ModalCenterBootstrapTable
              title="Lista de Clientes"
              data={clientes}
              onSelected={handleSelectedCliente}
            >
              <TableHeaderColumn dataField="id" isKey width="10%">
                #
              </TableHeaderColumn>
              <TableHeaderColumn dataField="name">Nome</TableHeaderColumn>
              <TableHeaderColumn dataField="cpf" width="30%">
                CPF/CNPJ
              </TableHeaderColumn>
            </ModalCenterBootstrapTable>
            <button
              className="btn btn-secondary"
              onClick={() => history.push("/cliente/register")}
            >
              Criar
            </button>
          </InputFormControl>
          <InputFormControl
            label="Data"
            type="date"
            id="inputData"
            name="inputData"
            defaultValue={data}
            onChange={(event) => setData(event.target.value)}
          />

        
            <button className="btn btn-primary" onClick={handleRegistraPedido}>
              Registra o pedido
            </button>
            </div>
  
      </div>
    </div>
  );
};
