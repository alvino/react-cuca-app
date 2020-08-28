import React, { useState, useEffect, useCallback } from "react";
import api from "../../server/api";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import BootstrapPaginationExportSearchDataTable from "../../components/bootstrap/BootstrapPaginationExportSearchDataTable";
import { toast } from "react-toastify";

const columns = [
  {
    dataField: "name",
    text: "Nome",
    sort: true,
  },
  {
    dataField: "cpf",
    text: "CPF/CNPJ",
    headerStyle: { width: "15%" },
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
  },
  {
    dataField: "telephone",
    text: "Telefone",
    headerStyle: { width: "10%" },
  },
  {
    dataField: "city",
    text: "Cidade",
    sort: true,
  },
  {
    dataField: "uf",
    text: "Estado",
    sort: true,
    headerStyle: { width: "5%" },
  },
];

export default () => {
  const history = useHistory();

  const [clients, setClients] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
      api.get("/client")
      .then( response => setClients(response.data.clients) )
      .catch((error) => {
        toast.error("Erro de rede ao acessar API");
        console.error(error);
      });
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

      <div>
        <BootstrapPaginationExportSearchDataTable
          keyField="cpf"
          data={clients}
          columns={columns}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};
