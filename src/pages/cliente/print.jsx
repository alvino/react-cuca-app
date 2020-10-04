import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import BootstrapDataTable from "../../components/patterns/DataTable";
import ModalCenterBootstrapTable from "../../components/patterns/ModalCenterBootstrapTable";
import { TableHeaderColumn } from "react-bootstrap-table";

import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import { ButtonHandlePrint } from "../../components/Buttons";
import BannerSimples from "../../components/print/BannerSimples";
import NumberFormat from "../../components/NumberFormat";
import Collapse from "../../components/Collapse";
import isObjectEmpty from "../../utils/isObjectEmpty";

import Print from "../../styles/Print";

export default () => {
  const history = useHistory();

  const [checked, setChecked] = useState(false);

  const [valorTotalCompra, setValorTotalCompra] = useState(0);

  const [clientes, setClientes] = useState(null);
  const [cliente, setCliente] = useState({});
  const [requestedBudgets, setRequestedBudgets] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("client");
      setClientes(response.data.clients);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isObjectEmpty(cliente)) return;

    async function fetchData() {
      const response = await api.get(`requested_budget/client/${cliente.id}`);
      setRequestedBudgets(response.data.requested_budgets);
    }
    fetchData();
  }, [cliente]);

  const handleSelectedCliente = useCallback((row) => {
    setCliente(row);
  }, []);

  useEffect(() => {
    setValorTotalCompra(
      requestedBudgets.reduce((acc, item) => {
        return acc + item.amount;
      }, 0.0)
    );
  }, [requestedBudgets]);

  useEffect(() => {
    if (!checked) {
      setCliente(null);
      setRequestedBudgets([]);
    }
  }, [checked]);

  const handlerFiltrer = useCallback((isFilter) => {
    setChecked(isFilter);
  }, []);

  const rowClassCheckFormat = (row, rowIdx) => {
    if (row.quantity - row.quantity_of <= 0) return "text-muted";
  };

  return (
    <Print>
      <div className="my-2 noprint">
        <div>
          <Collapse isFilter={true} handlerFilter={handlerFiltrer}>
            <div>
              <div className="form-group">
                <label htmlFor="inputCliente">Cliente</label>

                <div className="input-group mb-3">
                  <input
                    id="inputCliente"
                    value={isObjectEmpty(cliente) ? "" : cliente.name}
                  />
                  <div className="input-group-append">
                    <ModalCenterBootstrapTable
                      title="Lista de Clientes"
                      data={clientes}
                      onSelected={handleSelectedCliente}
                    >
                      <TableHeaderColumn dataField="id" isKey width="10%">
                        #
                      </TableHeaderColumn>
                      <TableHeaderColumn dataField="name">
                        Nome
                      </TableHeaderColumn>
                      <TableHeaderColumn dataField="cpf" width="30%">
                        CPF/CNPJ
                      </TableHeaderColumn>
                    </ModalCenterBootstrapTable>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
          <div className="btn-group my-2" role="group">
            <Button variant="secondary" onClick={() => history.goBack()}>
              Voltar
            </Button>
            <ButtonHandlePrint />
          </div>
        </div>
      </div>
      <div>
        <div className="print">
          <BannerSimples />

          <div className=" mb-auto">
            <p className="h2 text-center m-4">
              Relatorio do Consumo por Cliente
            </p>
            {isObjectEmpty(cliente) ? (
              ""
            ) : (
              <div className="my-3">
                <p>Nome: {cliente.name}</p>
                <p>Telefone: {cliente.telephone}</p>
                <p>Email: {cliente.email}</p>
              </div>
            )}

            <div className="mt-3">
              <BootstrapDataTable
                keyField="id"
                pagination={false}
                search={false}
                exportCSV={false}
                data={requestedBudgets}
                trClassName={rowClassCheckFormat}
              >
                <TableHeaderColumn dataField="id" width="8%" dataSort>
                  #
                </TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataSort>
                  Descrição
                </TableHeaderColumn>
                <TableHeaderColumn dataField="detail">
                  Detalhe
                </TableHeaderColumn>
                <TableHeaderColumn dataField="quantity" width="7%">
                  Qt.
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="sale_value"
                  dataSort
                  width="10%"
                  dataFormat={priceFormatter}
                >
                  Valor Unit.
                </TableHeaderColumn>
                
                <TableHeaderColumn
                  dataField="amount"
                  dataSort
                  width="12%"
                  dataFormat={priceFormatter}
                >
                  Vl_Compra
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="created_at"
                  dataSort
                  width="15%"
                  dataFormat={dateFormatter}
                >
                  Criado
                </TableHeaderColumn>
              </BootstrapDataTable>
            </div>
            <div className="mt-3">
              <p className="h4">
                Valor de Compra: <NumberFormat value={valorTotalCompra} />
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <ButtonHandlePrint />
        </div>
      </div>
    </Print>
  );
};
