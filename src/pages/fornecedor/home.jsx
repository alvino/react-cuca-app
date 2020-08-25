import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import api from "../../server/api";
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export default () => {
  const history = useHistory()

  const [providers, setProviders] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/provider")
      setProviders(response.data.providers)
    }
    fetchData()
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
          onClick={() => history.push('/fornecedor/register')}
        > Cadastra Fornecedor </Button>

        {
          rowSelected.isSelected ?
            <>
              <Button
                variant='info'
                className='p-2'
                size='lg'
                onClick={() => history.push(`/fornecedor/register/${rowSelected.row.id}`)}
              >Alterar Fornecedor</Button>

              <Button
                variant='danger'
                className='p-2'
                size='lg'
                onClick={() => history.push(`/fornecedor/delete/${rowSelected.row.id}`)}
              > Deletar Fornecedor</Button>
            </>
            : ""
        }
</div>
      </div>

      <BootstrapTable
        version="4"
        data={providers}
        selectRow={selectRow}
        pagination
        search
        hover
        exportCSV
        csvFileName="table-provider.csv"
        ignoreSinglePage
      >
        <TableHeaderColumn dataField="nickname" dataSort>
          Razão
        </TableHeaderColumn>
        <TableHeaderColumn dataField="email" dataSort>
          Email
        </TableHeaderColumn>
        <TableHeaderColumn dataField="telephone" >
          Telefone
        </TableHeaderColumn>
        <TableHeaderColumn dataField="cnpj" isKey={true} >
          CNPJ
        </TableHeaderColumn>
        <TableHeaderColumn dataField="city" dataSort>
          Cidade
        </TableHeaderColumn>
        <TableHeaderColumn dataField="uf" dataSort width='5%'>
          Uf
        </TableHeaderColumn>
        <TableHeaderColumn dataField="bank_data" >
          Dados Bancarios
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
}
