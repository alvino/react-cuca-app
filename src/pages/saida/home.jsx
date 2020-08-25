import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import api from "../../server/api";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";

export default () => {
  const history = useHistory();

  const [outlays, setOutlays] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    async function fetchData() {
      const query = { date_outlay: "" };

      const response = await api.get("/outlay", { params: query });
      setOutlays(response.data.outlays);
    }
    fetchData();
  }, []);

  function onRowSelect(row, isSelected) {
    setRowSelected({
      row,
      isSelected,
    });
  }

  const selectRow = {
    mode: "radio", //"checkbox",
    bgColor: "rgba(0,123,255,.4)",
    onSelect: onRowSelect,
    clickToSelect: true,
  };

  return (
    <>
      <div className="d-flex mb-5 justify-content-center">
        <div className="btn-group " role="group">
          <Button
            variant="primary"
            size="lg"
            onClick={() => history.push("/saida/register")}
          >
            Cadastra Saida
          </Button>

          {rowSelected.isSelected ? (
            <Button
              variant="danger"
              size="lg"
              onClick={() =>
                history.push(`/saida/delete/${rowSelected.row.id}`)
              }
            >
              Deletar Saida
            </Button>
          ) : (
            ""
          )}

          <Button
            variant="success"
            size="lg"
            onClick={() => history.push(`/saida/print`)}
          >
            Relatorio de Gastos
          </Button>
        </div>

        
      </div>

      <div >
        

        <BootstrapTable
          version="4"
          data={outlays}
          selectRow={selectRow}
          pagination
          search
          hover
          exportCSV
          csvFileName={`tabela de gastos.csv`}
          ignoreSinglePage
        >
          <TableHeaderColumn dataField="id" isKey={true} width="5%">
            COD.
          </TableHeaderColumn>
          <TableHeaderColumn dataField="description" dataSort>
            Descrição
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="amount"
            dataSort
            dataFormat={priceFormatter}
            width="10%"
          >
            Valor
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="date_outlay"
            dataSort
            dataFormat={dateFormatter}
            width="10%"
          >
            Data
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    </>
  );
};
