import React, { useState, useEffect } from "react";
import api from "../../server/api";
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'


import {priceFormatter, numberFormatter} from '../../utils/react-bootstrap-table-formatted'
import BootstrapPaginationExportSearchDataTable from "../../components/bootstrap/BootstrapPaginationExportSearchDataTable";

const columns = [
  {
    dataField: "id",
    text: "Cod",
    sort: true,
    headerStyle: { width: "5%" },
  },
  {
    dataField: "description",
    text: "Descrição",
    sort: true,
  },
  {
    dataField: "detail",
    text: "Detalhe",
    sort: true,
  },
  {
    dataField: "unit",
    text: "UND",
    headerStyle: { width: "5%" },
  },
  {
    dataField: "stock",
    text: "Estoque",
    sort: true,
    headerStyle: { width: "7%" },
    formatter: numberFormatter,
  },
  {
    dataField: "sale_value",
    text: "Valor de Venda",
    sort: true,
    headerStyle: { width: "10%" },
    formatter: priceFormatter,
  }
];


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

  function onSelect(row, isSelected) {
    setRowSelected({ row, isSelected })
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

      <BootstrapPaginationExportSearchDataTable
        keyField='id'
        data={stocks}
        onSelect={onSelect}
        columns={columns}
      />
        
    </div>
  );
}
