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

  const [sales, setSales] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    async function fetchData() {
      
      const response = await api.get("/sale", { params: {date_sale: ''} });
      setSales(response.data.sales);
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
          <div className="btn-group " role="group" >
            <Button
              variant="primary"
              size="lg"
              onClick={() => history.push("/entrada/register")}
            >
              Cadastra Entrada
            </Button>

            {rowSelected.isSelected && !rowSelected.row.budget_id ? (
              <Button
                variant="danger"
                size="lg"
                onClick={() =>
                  history.push(`/entrada/delete/${rowSelected.row.id}`)
                }
              >
                Deletar Entrada
              </Button>
            ) : (
              ""
            )}
          
            <Button
              variant="success"
              size="lg"
              onClick={() => history.push(`/entrada/print`)}
            >
              Relatorio de Ganhos
            </Button>
          </div>

          
        </div>

        <div>
          
          <BootstrapTable
            version="4"
            data={sales}
            selectRow={selectRow}
            pagination
            search
            hover
            exportCSV
            csvFileName={`tabela de entradas.csv`}
            ignoreSinglePage
          >
            <TableHeaderColumn dataField="id" isKey={true} width="5%">
              COD.
            </TableHeaderColumn>
            <TableHeaderColumn dataField="description" dataSort>
              Descrição
            </TableHeaderColumn>
            <TableHeaderColumn dataField="parcel" width="5%">
              De
            </TableHeaderColumn>
            <TableHeaderColumn dataField="all_parcel" width="5%">
              Parcelas
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
              dataField="date_sale"
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
