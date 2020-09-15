import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../server/api";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";

import { useCallback } from "react";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../components/patterns/DataTable";

export default () => {
  const history = useHistory();

  const [outlays, setOutlays] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    const query = { date_outlay: "" };

    api
      .get("/outlay", { params: query })
      .then((response) => {
        setOutlays(response.data.outlays);
      })
      .catch((error) => {
        toast.error("Erro ao acessar API");
        console.error(error);
      });
  }, []);

  const onSelect = useCallback((row, isSelected) => {
    setRowSelected({
      row,
      isSelected,
    });
  }, []);

  return (
    <>
      <div className="d-flex mb-5 justify-content-center">
        <div className="btn-group " role="group">
          <Button
            variant="primary"
            onClick={() => history.push("/saida/register")}
          >
            Cadastra Saida
          </Button>

          {rowSelected.isSelected && (
            <Button
              variant="danger"
              onClick={() =>
                history.push(`/saida/delete/${rowSelected.row.id}`)
              }
            >
              Deletar Saida
            </Button>
          ) }

          <Button
            variant="success"
            onClick={() => history.push(`/saida/print`)}
          >
            Relatorio de Gastos
          </Button>
        </div>
      </div>

      <div>
        <BootstrapDataTable
          data={outlays}
          onSelect={onSelect}
          keyField='id'
        >
          <TableHeaderColumn dataField="id" dataSort width="5%">
            #
          </TableHeaderColumn>
          <TableHeaderColumn dataField="description" dataSort>
            Descrição
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="amount"
            dataSort
            width="10%"
            dataFormat={priceFormatter}
          >
            Valor
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="date_outlay"
            dataSort
            width="10%"
            dataFormat={dateFormatter}
          >
            Data
          </TableHeaderColumn>
        </BootstrapDataTable>
      </div>
    </>
  );
};
