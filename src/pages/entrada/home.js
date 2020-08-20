import React, { useState, useEffect } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import api from '../../server/api'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'


import NumberFormat from '../../components/NumberFormat'
import DateFormat from '../../components/DateFormat'


export default () => {
  const history = useHistory()

  const [sales, setSales] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/sale")
      // const serializedSales = response.data.sales.map((item) => (
      //   {
      //     ...item,
          
      //   }
      // ))
      setSales(response.data.sales)
    }
    fetchData()
  }, []);

  function priceFormatter(cell, row) {
    return <NumberFormat value={parseFloat(cell)} />
  }

  function dateFormatter(cell, row) {
    return <DateFormat value={cell} />
  }

  function onRowSelect(row, isSelected) {
    setRowSelected({ row, isSelected })
  }

  const selectRow = {
    mode: "radio",//"checkbox",
    bgColor: "rgba(0,123,255,.4)",
    onSelect: onRowSelect,
    clickToSelect: true,
  }

  return (
    <div >
      <div className="d-flex justify-content-center">

        <Button
          variant='primary'
          className='m-2' size='lg'
          onClick={() => history.push('/entrada/register')}
        >Cadastra Entrada</Button>

        {
          rowSelected.isSelected && !rowSelected.row.budget_id ?
            <>
              <Button
                variant='danger'
                className='m-2'
                size='lg'
                onClick={() => history.push(`/entrada/delete/${rowSelected.row.id}`)}
              >Deletar Entrada</Button>
            </>
            : ""
        }


      </div>

      <BootstrapTable
        version="4"
        data={sales}
        selectRow={selectRow}
        pagination
        search
        hover
        exportCSV
        csvFileName="table-clientes.csv"
        ignoreSinglePage
      >

        <TableHeaderColumn dataField="id" isKey={true} width='5%'>
          COD.
        </TableHeaderColumn>
        <TableHeaderColumn dataField="description" dataSort>
          Descrição
        </TableHeaderColumn>
        <TableHeaderColumn dataField="parcel" width='5%' >
          De
        </TableHeaderColumn>
        <TableHeaderColumn dataField="all_parcel" width='5%' >
          Parcelas
        </TableHeaderColumn>
        <TableHeaderColumn dataField="amount" dataSort dataFormat={priceFormatter} width='10%'>
          Valor
        </TableHeaderColumn>
        <TableHeaderColumn dataField="date_sale" dataSort dataFormat={dateFormatter} width='10%'>
          Data
        </TableHeaderColumn>
      </BootstrapTable>
    </div >
  );
}
