import React, { useState, useEffect } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from "../../server/api";


export default () => {
  const [providers, setProviders] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/provider")
      toast.info(response.data.message)
      setProviders(response.data.providers)
    }
    fetchData()
  }, []);

  function onRowSelect(row, isSelected) {
    setRowSelected({ row, isSelected })
  }


  const selectRow = {
    mode: "radio",
    // clickToSelect: true,
    // selected: [], // default select on table
    bgColor: "rgba(0,123,255,.4)",
    onSelect: onRowSelect,
    // onSelectAll: onSelectAll,
  }


  return (
    <div>
      <ul className="nav justify-content-center">
        <li>
          <Link to="/fornecedor/register" className="nav-link btn-primary">
            Cadastra Fornecedor
        </Link>
        </li>
        {
          rowSelected.isSelected ?
            <li className="nav-item m-2">
              <Link to={`/fornecedor/register/${rowSelected.row.id}`} className="nav-link btn-info">
                Alterar Fornecedor
              </Link>
            </li>
            : ""
        }
        {
          rowSelected.isSelected ?
            <li className="nav-item m-2">
              <Link to={`/fornecedor/delete/${rowSelected.row.id}`} className="nav-link btn-danger" >
                Deletar Fornecedor
              </Link>
            </li>
            : ""
        }
      </ul>

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
          Dmail
        </TableHeaderColumn>
        <TableHeaderColumn dataField="telephone" dataSort>
          Telefone
        </TableHeaderColumn>
        <TableHeaderColumn dataField="cnpj" isKey={true} dataSort>
          CNPJ
        </TableHeaderColumn>
        <TableHeaderColumn dataField="city" dataSort>
          Cidade
        </TableHeaderColumn>
        <TableHeaderColumn dataField="uf" dataSort>
          Uf
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
}
