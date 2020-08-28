import React, { useState, useEffect, useCallback } from "react";
import api from "../../server/api";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import BootstrapPaginationExportSearchDataTable from "../../components/bootstrap/BootstrapPaginationExportSearchDataTable";

const columns = [
  {
    dataField: "nickname",
    text: "Empresa",
    sort: true,
  },
  {
    dataField: "cnpj",
    text: "CNPJ/CPF",
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
  {
    dataField: "bank_data",
    text: "Dados Bancarios",
  },
];

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
    <div>
      <div className="d-flex justify-content-center">
        <div className="btn-group " role="group">
          <Button
            variant="primary"
            className="p-2"
            size="lg"
            onClick={() => history.push("/fornecedor/register")}
          >
            {" "}
            Cadastra Fornecedor{" "}
          </Button>

          {rowSelected.isSelected ? (
            <>
              <Button
                variant="info"
                className="p-2"
                size="lg"
                onClick={() =>
                  history.push(`/fornecedor/register/${rowSelected.row.id}`)
                }
              >
                Alterar Fornecedor
              </Button>

              <Button
                variant="danger"
                className="p-2"
                size="lg"
                onClick={() =>
                  history.push(`/fornecedor/delete/${rowSelected.row.id}`)
                }
              >
                {" "}
                Deletar Fornecedor
              </Button>
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      <BootstrapPaginationExportSearchDataTable
        keyField="cnpj"
        data={providers}
        onSelect={onSelect}
        columns={columns}
      />
    </div>
  );
};
