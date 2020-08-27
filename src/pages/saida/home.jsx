import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

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
    sort: true,headerStyle: { width: "5%" },
  },
  {
    dataField: "description",
    text: "Descrição",sort: true,
  },
  {
    dataField: "amount",
    text: "Valor",
    sort: true,headerStyle: { width: "10%" },
    formatter: priceFormatter,
  },
  {
    dataField: "date_outlay",
    text: "Data",
    headerStyle: { width: "10%" },
    formatter: dateFormatter,
  },
  
];



export default () => {
  const history = useHistory();

  const [outlays, setOutlays] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    async function fetchData() {
      const query = { date_outlay: "" };

      const response = await api.get("/outlay", { params: query });
      setOutlays(response.data.outlays);
    }
    fetchData();
  }, []);

  function onSelect(row, isSelected) {
    setRowSelected({
      row,
      isSelected,
    });
  }

  return (
    <>
      <div className="d-flex mb-5 justify-content-center">
        <div className="btn-group " role="group">
          <Button
            variant="primary"
            size="lg"
            onClick={() => history.push("/saida/register")}
          >
            Cadastra Saida
          </Button>

          {rowSelected.isSelected ? (
            <Button
              variant="danger"
              size="lg"
              onClick={() =>
                history.push(`/saida/delete/${rowSelected.row.id}`)
              }
            >
              Deletar Saida
            </Button>
          ) : (
            ""
          )}

          <Button
            variant="success"
            size="lg"
            onClick={() => history.push(`/saida/print`)}
          >
            Relatorio de Gastos
          </Button>
        </div>

        
      </div>

      <div >
        

        <BootstrapPaginationExportSearchDataTable
          keyField='id'
          data={outlays}
          onSelect={onSelect}
          columns={columns}
        />
         
      </div>
    </>
  );
};