import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import BootstrapDataTable from "../../components/patterns/DataTable";
import { TableHeaderColumn } from "react-bootstrap-table";

export default () => {
  const history = useHistory();

  const [providers, setProviders] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    api
      .get("/provider")
      .then((response) => {
        setProviders(response.data.providers);
      })
      .catch((error) => {
        toast.error("Erro ao acessar API");
        console.error(error);
      });
  }, []);

  const onSelect = useCallback((row, isSelected) => {
    setRowSelected({ row, isSelected });
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="btn-group " role="group">
          <Button
            variant="primary"
            className="p-2"
            onClick={() => history.push("/fornecedor/register")}
          >
            
            Cadastra Fornecedor
          </Button>

          {rowSelected.isSelected && (
            <>
              <Button
                variant="info"
                className="p-2"
                onClick={() =>
                  history.push(`/fornecedor/register/${rowSelected.row.id}`)
                }
              >
                Alterar Fornecedor
              </Button>

              <Button
                variant="danger"
                className="p-2"
                onClick={() =>
                  history.push(`/fornecedor/delete/${rowSelected.row.id}`)
                }
              >
                
                Deletar Fornecedor
              </Button>
            </>
          ) }
        </div>
      </div>

      <BootstrapDataTable
        keyField="cnpj"
        data={providers}
        onSelect={onSelect}
      >
        <TableHeaderColumn dataField="nickname" dataSort>
          Empresa
        </TableHeaderColumn>
        <TableHeaderColumn dataField="cnpj" width="15%">
          CNPJ/CPF
        </TableHeaderColumn>
        <TableHeaderColumn dataField="email" dataSort>
          Email
        </TableHeaderColumn>
        <TableHeaderColumn dataField="telephone" width="10%">
          Telefone
        </TableHeaderColumn>
        <TableHeaderColumn dataField="bank_data">
          Dados Bancarios
        </TableHeaderColumn>
        <TableHeaderColumn dataField="city" dataSort>
          Cidade
        </TableHeaderColumn>
        <TableHeaderColumn dataField="uf" dataSort width="10%">
          UF
        </TableHeaderColumn>
      </BootstrapDataTable>
    </>
  );
};
