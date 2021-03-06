import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../components/patterns/DataTable";
import { toast } from "react-toastify";

export default () => {
  const history = useHistory();

  const [clients, setClients] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {

    async function fetch(){
      try{
        const response = await api.get("/client")
        setClients(response.data.clients)
      }catch(error) {
        toast.error("Erro de rede ao acessar API");
      }
    }

    fetch()
  }, []);

  const onSelect = useCallback((row, isSelected) => {
    setRowSelected({ row, isSelected });
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="btn-group " role="group">
          <Button
            variant="primary"
            className="p-2"
            onClick={() => history.push("/cliente/register")}
          >
            Cadastra Cliente
          </Button>

          {rowSelected.isSelected ? (
            <>
              <Button
                variant="info"
                className="p-2"
                onClick={() =>
                  history.push(`/cliente/register/${rowSelected.row.id}`)
                }
              >
                Alterar Cliente
              </Button>

              <Button
                variant="danger"
                className="p-2"
                onClick={() =>
                  history.push(`/cliente/delete/${rowSelected.row.id}`)
                }
              >
                Deletar Cliente
              </Button>
            </>
          ) : (
            ""
          )}
          <Button
            variant="success"
            onClick={() => history.push(`/cliente/print`)}
          >
            Relatorio de Comsumo
          </Button>
        </div>
      </div>

      <div>
        <BootstrapDataTable data={clients} onSelect={onSelect}>
          <TableHeaderColumn dataField="id" isKey dataSort width="6%">
            Cod.
          </TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataSort>
            Nome
          </TableHeaderColumn>
          <TableHeaderColumn dataField="cpf" width="15%">
            CPF/CNPJ
          </TableHeaderColumn>
          <TableHeaderColumn dataField="email" dataSort>
            Email
          </TableHeaderColumn>
          <TableHeaderColumn dataField="telephone" width="10%">
            Telefone
          </TableHeaderColumn>
          <TableHeaderColumn dataField="city" dataSort>
            Cidade
          </TableHeaderColumn>
          <TableHeaderColumn dataField="uf" dataSort width="7%">
            Estado
          </TableHeaderColumn>
        </BootstrapDataTable>
      </div>
    </div>
  );
};
