import React, { useState, useEffect } from "react";
import api from "../../server/api";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import BootstrapDataTable from "../../components/patterns/DataTable";
import { useCallback } from "react";
import { TableHeaderColumn } from "react-bootstrap-table";

export default () => {
  const history = useHistory();

  const [orcamentos, setOrcamentos] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get("/budget");
        setOrcamentos(response.data.budgets);
      } catch (error) {
        toast.error("Erro ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, []);

  const onSelect = useCallback((row, isSelected) => {
    setRowSelected({ row, isSelected });
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-center">
        {rowSelected.isSelected && (
          <div className="btn-group " role="group">
            <Button
              variant="primary"
              className="p-2"
              onClick={() => history.push(`/venda/${rowSelected.row.id}`)}
            >
              Abrir o Orçamento
            </Button>

            <Button
              variant="success"
              className="p-2"
              onClick={() =>
                history.push(`/orcamento/print/${rowSelected.row.id}`)
              }
            >
              Imprimir Orcamento
            </Button>

            <Button
              variant="danger"
              className="p-2"
              onClick={() =>
                history.push(`/orcamento/delete/${rowSelected.row.id}`)
              }
            >
              Deletar Orcamento
            </Button>
          </div>
        )}
      </div>

      <BootstrapDataTable data={orcamentos} onSelect={onSelect} keyField="id">
        <TableHeaderColumn dataField="id" dataSort width="5%">
          Cod
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort>
          Nome
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="amount"
          width="10%"
          dataFormat={priceFormatter}
        >
          Valor Total
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="created_at"
          dataSort
          width="10%"
          dataFormat={dateFormatter}
        >
          Data
        </TableHeaderColumn>
      </BootstrapDataTable>
    </div>
  );
};
