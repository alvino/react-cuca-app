import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import api from "../../server/api";
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'


import {priceFormatter, numberFormatter} from '../../utils/react-bootstrap-table-formatted'


export default () => {
  const history = useHistory()
  const [stocks, setStocks] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    async function fetchDataStock() {
      const response = await api.get("/stock")
      const serializeStock = response.data.stocks.map(
        (item) => ({ ...item, stock: Number(item.quantity_purchase - item.sale_amount).toFixed(2) })
      )

      setStocks(serializeStock.filter((item) => (item.stock > 0)))
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
    clickToSelect: true,
  }

  
  return (
    <div>
      <div className="d-flex justify-content-center">
      <div className="btn-group " role="group" >
        <Button
          variant='primary'
          className='p-2'
          size='lg'
          onClick={() => history.push('/estoque/register')}
        > Cadastra Estoque </Button>

        {
          rowSelected.isSelected ?
            <Button
              variant='danger'
              className='p-2'
              size='lg'
              onClick={() => history.push(`/estoque/delete/${rowSelected.row.id}`)}
            > Deletar Estoque</Button>

            : ""
        }
      </div>
</div>

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
        <TableHeaderColumn dataField="id" isKey={true} dataSort width='5%'>
          COD
        </TableHeaderColumn>
        <TableHeaderColumn dataField="description" dataSort>
          Descrição
        </TableHeaderColumn>
        <TableHeaderColumn dataField="detail" dataSort>
          Detalhe
        </TableHeaderColumn>
        <TableHeaderColumn dataField="unit" width='5%'>
          UND
        </TableHeaderColumn>
        <TableHeaderColumn dataField="stock" dataSort width='10%' dataFormat={numberFormatter}>
          Estoque
        </TableHeaderColumn>
        <TableHeaderColumn dataField="sale_value" dataSort width='10%' dataFormat={priceFormatter} >
          Valor de Venda
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
}
