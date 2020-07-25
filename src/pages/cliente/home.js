import React, { useState, useEffect } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Link } from 'react-router-dom'
import api from '../../server/api'


export default () => {

  const [clients, setClients] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/client")
      setClients(response.data.clients, { autoClose: 2000 })
    }
    fetchData()
  }, []);

  function onRowSelect(row, isSelected) {
    setRowSelected({ row, isSelected })
  }

  const selectRow = {
    mode: "radio",//"checkbox",
    bgColor: "rgba(0,123,255,.4)",
    onSelect: onRowSelect,
  }

  return (
    <div >
      <ul className="nav justify-content-center">
        <li className="nav-item mx-2">
          <Link to="/cliente/register" className="nav-link btn-primary">
            Cadastra Cliente
        </Link>
        </li>
        {
          rowSelected.isSelected ?
            <li className="nav-item mx-2">
              <Link to={`/cliente/register/${rowSelected.row.id}`} className="nav-link btn-info">
                Alterar Cliente
              </Link>
            </li>
            : ""
        }
        {
          rowSelected.isSelected ?
            <li className="nav-item mx-2">
              <Link to={`/cliente/delete/${rowSelected.row.id}`} className="nav-link btn-danger" >
                Deletar Cliente
              </Link>
            </li>
            : ""
        }

      </ul>

      <BootstrapTable
        version="4"
        data={clients}
        selectRow={selectRow}
        pagination
        search
        hover
        exportCSV
        csvFileName="table-clientes.csv"
        ignoreSinglePage
      >

        <TableHeaderColumn dataField="name" dataSort>
          Name
        </TableHeaderColumn>
        <TableHeaderColumn dataField="email" dataSort>
          Email
        </TableHeaderColumn>
        <TableHeaderColumn dataField="telephone" dataSort>
          Telefone
        </TableHeaderColumn>
        <TableHeaderColumn dataField="cpf" isKey={true} dataSort>
          CPF
        </TableHeaderColumn>
        <TableHeaderColumn dataField="city" dataSort>
          Cidade
        </TableHeaderColumn>
        <TableHeaderColumn dataField="uf" dataSort>
          Uf
        </TableHeaderColumn>
      </BootstrapTable>
    </div >
  );
}
