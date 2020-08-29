import React, { useState, useEffect } from "react";
import api from "../../server/api";
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import {toast} from 'react-toastify'


import {priceFormatter, dateFormatter} from '../../utils/react-bootstrap-table-formatted'
import BootstrapPaginationExportSearchDataTable from "../../components/bootstrap/BootstrapPaginationExportSearchDataTable";
import { useCallback } from "react";

const columns = [
  {
    dataField: "id",
    text: "Cod",
    sort: true,
    headerStyle: { width: "5%" },
  },
  {
    dataField: "name",
    text: "Nome",
    sort: true,
  },
  {
    dataField: "amount",
    text: "valor Total",
    formatter: priceFormatter,
    headerStyle: { width: "10%" },
  },
  {
    dataField: "created_at",
    text: "Data",
    sort: true,
    headerStyle: { width: "10%" },
    formatter: dateFormatter
  }
];


export default () => {
  const history = useHistory()

  const [orcamentos, setOrcamentos] = useState([]);
  const [rowSelected, setRowSelected] = useState({ row: {}, isSelected: false })

  useEffect(() => {
    api.get("/budget")
    .then( response => {
      setOrcamentos(response.data.budgets)
    })
    .catch( error => {
      toast.error('Erro ao acessar API')
      console.error(error)
    })
  }, []);

  const onSelect = useCallback( (row, isSelected) => {
    setRowSelected({ row, isSelected })
  }, [])

 
  return (
    <div>

      <div className="d-flex justify-content-center">



        {
          rowSelected.isSelected ?
          <div className="btn-group " role="group" >
              <Button
                variant='primary'
                className='p-2'
                onClick={() => history.push(`/venda/fechamentodevenda/${rowSelected.row.id}`)}
              > Finalizar Venda </Button>

              <Button
                variant='success'
                className='p-2'
                onClick={() => history.push(`/orcamento/print/${rowSelected.row.id}`)}
              > Imprimir Orcamento </Button>

              <Button
                variant='danger'
                className='p-2'
                onClick={() => history.push(`/orcamento/delete/${rowSelected.row.id}`)}
              > Deletar Orcamento</Button>
            </div>
            : ""
        }

      </div>

      <BootstrapPaginationExportSearchDataTable
        keyField='id'
        data={orcamentos}
        onSelect={onSelect}
        columns={columns}
      />
        
    </div>
  );
}
