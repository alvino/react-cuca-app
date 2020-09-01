import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

import api from "../../server/api";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";

import BootstrapDataTable from "../../components/bootstrap/DataTable";

export default () => {
  const history = useHistory();

  const [sales, setSales] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    api
      .get("/sale", { params: { date_sale: "" } })
      .then((response) => {
        setSales(response.data.sales);
      })
      .catch((error) => {
        toast.error("Erro de rede ao acessar API");
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
            onClick={() => history.push("/entrada/register")}
          >
            Cadastra Entrada
          </Button>

          { (rowSelected.isSelected && !rowSelected.row.budget_id) || (
            <Button
              variant="danger"
              onClick={() =>
                history.push(`/entrada/delete/${rowSelected.row.id}`)
              }
            >
              Deletar Entrada
            </Button>
          ) }

          <Button
            variant="success"
            onClick={() => history.push(`/entrada/print`)}
          >
            Relatorio de Ganhos
          </Button>
        </div>
      </div>

      <div>
        <BootstrapDataTable
          data={sales}
          onSelect={onSelect}
        >
          <TableHeaderColumn dataField="id" isKey dataSort width="5%">
            Cod
          </TableHeaderColumn>
          <TableHeaderColumn dataField="description" dataSort>
            Descrição
          </TableHeaderColumn>
          <TableHeaderColumn dataField="parcel" width="5%">
            De
          </TableHeaderColumn>
          <TableHeaderColumn dataField="all_parcel" width="5%">
            Par
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
            dataField="date_sale"
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
