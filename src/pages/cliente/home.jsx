import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import api from "../../server/api";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default () => {
  const history = useHistory();

  const [clients, setClients] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/client");
      setClients(response.data.clients);
    }
    fetchData();
  }, []);

  function onRowSelect(row, isSelected) {
    setRowSelected({ row, isSelected });
  }

  const selectRow = {
    mode: "radio", //"checkbox",
    bgColor: "rgba(0,123,255,.4)",
    onSelect: onRowSelect,
    clickToSelect: true,
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="btn-group " role="group">
          <Button
            variant="primary"
            className="p-2"
            size="lg"
            onClick={() => history.push("/cliente/register")}
          >
            Cadastra Cliente
          </Button>

          {rowSelected.isSelected ? (
            <>
              <Button
                variant="info"
                className="p-2"
                size="lg"
                onClick={() =>
                  history.push(`/cliente/register/${rowSelected.row.id}`)
                }
              >
                Alterar Cliente
              </Button>

              <Button
                variant="danger"
                className="p-2"
                size="lg"
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
        </div>
      </div>

      <BootstrapTable
        version="4"
        data={clients}
        selectRow={selectRow}
        pagination
        search
        hover
        exportCSV
        csvFileName="table-clientes.csv"
        ignoreSinglePage
      >
        <TableHeaderColumn dataField="name" dataSort>
          Name
        </TableHeaderColumn>
        <TableHeaderColumn dataField="email" dataSort>
          Email
        </TableHeaderColumn>
        <TableHeaderColumn dataField="telephone">Telefone</TableHeaderColumn>
        <TableHeaderColumn dataField="cpf" isKey={true} width="15%">
          CPF/CNPJ
        </TableHeaderColumn>
        <TableHeaderColumn dataField="city" dataSort>
          Cidade
        </TableHeaderColumn>
        <TableHeaderColumn dataField="uf" dataSort width="5%">
          Uf
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
};
