import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Link } from 'react-router-dom'
import api from "../../server/api";


export default () => {
  const [stocks, setStocks] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    async function fetchDataStock() {
      const response = await api.get("/stock")
      setStocks(response.data.stocks)
    }
    fetchDataStock()
  }, []);

  function onRowSelect(row, isSelected) {
    setRowSelected({ row, isSelected })
  }

  const selectRow = {
    mode: "radio",
    bgColor: "rgba(0,123,255,.4)",
    onSelect: onRowSelect,
  }

  return (
    <div>
      <ul className="nav justify-content-center">
        <li className="nav-item mx-2">
          <Link to="/estoque/register" className="nav-link btn-primary">
            Cadastra Estoque
        </Link>
        </li>

        {
          rowSelected.isSelected ?
            <li className="nav-item mx-2">
              <Link to={`/estoque/delete/${rowSelected.row.id}`} className="nav-link btn-danger" >
                Deletar Estoque
              </Link>
            </li>
            : ""
        }
      </ul>

      <BootstrapTable
        version="4"
        data={stocks}
        selectRow={selectRow}
        pagination
        search
        hover
        exportCSV
        csvFileName="table-stock.csv"
        ignoreSinglePage
      >
        <TableHeaderColumn dataField="id" isKey={true} dataSort>
          COD
        </TableHeaderColumn>
        <TableHeaderColumn dataField="description" dataSort>
          Descrição
        </TableHeaderColumn>
        <TableHeaderColumn dataField="detail" dataSort>
          Detalhe
        </TableHeaderColumn>
        <TableHeaderColumn dataField="unit" dataSort>
          UND
        </TableHeaderColumn>
        <TableHeaderColumn dataField="quantity_purchase" dataSort>
          Qt.
        </TableHeaderColumn>
        <TableHeaderColumn dataField="sale_amount" dataSort>
          Qt. OF
        </TableHeaderColumn>
        <TableHeaderColumn dataField="sale_value" dataSort>
          Valor de Venda
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
}
