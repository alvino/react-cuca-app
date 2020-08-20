import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import api from "../../server/api";
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'


import NumberFormat from '../../components/NumberFormat'
import DateFormat from '../../components/DateFormat'


export default () => {
  const history = useHistory()

  const [orcamentos, setOrcamentos] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/budget")
      setOrcamentos(response.data.budgets)
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
    mode: "radio",
    bgColor: "rgba(0,123,255,.4)",
    onSelect: onRowSelect,
    clickToSelect: true,
  }

  return (
    <div>

      <div className="d-flex justify-content-center">



        {
          rowSelected.isSelected ?
            <>
              <Button
                variant='primary'
                className='m-2'
                size='lg'
                onClick={() => history.push(`/venda/fechamentodevenda/${rowSelected.row.id}`)}
              > Finalizar Venda </Button>

              <Button
                variant='success'
                className='m-2'
                size='lg'
                onClick={() => history.push(`/orcamento/print/${rowSelected.row.id}`)}
              > Imprimir Orcamento </Button>

              <Button
                variant='danger'
                className='m-2'
                size='lg'
                onClick={() => history.push(`/orcamento/delete/${rowSelected.row.id}`)}
              > Deletar Orcamento</Button>
            </>
            : ""
        }

      </div>

      <BootstrapTable
        version="4"
        data={orcamentos}
        selectRow={selectRow}
        pagination
        search
        hover
        exportCSV
        csvFileName="table-provider.csv"
        ignoreSinglePage
      >
        <TableHeaderColumn dataField="id" isKey={true} dataSort width='5%'>
          COD.
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort>
          Cliente
        </TableHeaderColumn>
        <TableHeaderColumn dataField="amount" dataSort width='15%' dataFormat={priceFormatter}>
          Valor Total
        </TableHeaderColumn>
        <TableHeaderColumn dataField="created_at" dataSort width='15%' dataFormat={dateFormatter}>
          Data
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
}
