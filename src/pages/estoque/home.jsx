import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useHistory } from "react-router-dom";

import {
  priceFormatter,
  numberFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import BootstrapDataTable from "../../components/patterns/DataTable";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

export default () => {
  const history = useHistory();
  const [stocks, setStocks] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get("/stock");
        const serializeStock = response.data.stocks.map((item) => ({
          ...item,
          stock: Number(item.quantity - item.quantity_of).toFixed(2),
        }));
        setStocks(serializeStock.filter((item) => item.stock > 0));
      } catch (error) {
        toast.error("Erro no acesso a API");
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
        <div className="btn-group " role="group">
          <button
            className="p-2 btn btn-primary"
            onClick={() => history.push("/estoque/register")}
          >
            Cadastra Estoque
          </button>

          {rowSelected.isSelected && (
            <>
              <button
                className="p-2 btn btn-info"
                onClick={() =>
                  history.push(`/estoque/alterar/${rowSelected.row.id}`)
                }
              >
                Alterar Estoque
              </button>
              <button
                className="p-2 btn btn-danger"
                onClick={() =>
                  history.push(`/estoque/delete/${rowSelected.row.id}`)
                }
              >
                Deletar Estoque
              </button>
            </>
          )}

          <button
            className="btn btn-success p-2w"
            onClick={() => history.push(`/estoque/print`)}
          >
            Relatorio de Estoque
          </button>
        </div>
      </div>

      <BootstrapDataTable data={stocks} onSelect={onSelect} keyField="id">
        <TableHeaderColumn dataField="id" dataSort width="5%">
          Cod
        </TableHeaderColumn>
        <TableHeaderColumn dataField="description" dataSort>
          Descrição
        </TableHeaderColumn>
        <TableHeaderColumn dataField="detail" dataSort>
          Detalhe
        </TableHeaderColumn>
        <TableHeaderColumn dataField="unit" width="5%">
          Unid.
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="stock"
          dataSort
          width="7%"
          dataFormat={numberFormatter}
        >
          Estoque
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="sale_value"
          width="10%"
          dataSort
          dataFormat={priceFormatter}
        >
          Valor de Venda
        </TableHeaderColumn>
      </BootstrapDataTable>
    </div>
  );
};
