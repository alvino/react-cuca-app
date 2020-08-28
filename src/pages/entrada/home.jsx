import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {toast} from 'react-toastify'


import api from "../../server/api";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
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
    dataField: "parcel",
    text: "De",
    headerStyle: { width: "5%" },
  },
  {
    dataField: "all_parcel",
    text: "Par.",
    headerStyle: { width: "5%" },
  },
  {
    dataField: "amount",
    text: "Valor",
    sort: true,
    headerStyle: { width: "10%" },
    formatter: priceFormatter,
  },
  {
    dataField: "date_sale",
    text: "Data",
    sort: true,
    headerStyle: { width: "10%" },
    formatter: dateFormatter,
  }
];


export default () => {
  const history = useHistory();

  const [sales, setSales] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    api.get("/sale", { params: {date_sale: ''} })
    .then( response => {
      setSales(response.data.sales);
    })
    .catch((error) => {
      toast.error("Erro de rede ao acessar API");
      console.error(error);
    });
  }, []);


  const onSelect = useCallback((row, isSelected) => {
    setRowSelected({
      row,
      isSelected,
    });
  }, [] )


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
          
          <BootstrapPaginationExportSearchDataTable
            keyField="id"
            data={sales}
            onSelect={onSelect}
            columns={columns}
          />
            
        </div>
    </>
  );
};
