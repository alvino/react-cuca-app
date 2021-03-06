import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import BootstrapDataTable from "../../components/patterns/DataTable";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import { ButtonHandlePrint } from "../../components/Buttons";
import BannerSimples from "../../components/print/BannerSimples";
import NumberFormat from "../../components/NumberFormat";
import Collapse from "../../components/Collapse";

import Print from "../../styles/Print";

export default () => {
  const history = useHistory();

  const [checked, setChecked] = useState(false);

  const [stocks, setStocks] = useState([]);
  const [listaStock, setListaStock] = useState([]);

  const [fornecedores, setFornecedores] = useState([]);
  const [selectFornecedor, setSelectFornecedor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [stockEmpty, setStockEmpty] = useState(false);

  const [valorTotalCompra, setValorTotalCompra] = useState(0);
  const [valorTotalVenda, setValorTotalVenda] = useState(0);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get("/stock");
        setStocks(response.data.stocks);
      } catch (error) {
        toast.error("Erro de rede ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get("/provider");
        setFornecedores(response.data.providers);
      } catch (error) {
        toast.error("Erro de rede ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    let responseCheckListStock = stocks;

    if (selectFornecedor !== "") {
      responseCheckListStock = responseCheckListStock.filter(
        (item) => item.provider_id === Number(selectFornecedor)
      );
    }

    if (descricao !== "") {
      responseCheckListStock = responseCheckListStock.filter((item) =>
        item.description.toLowerCase().includes(descricao.toLowerCase())
      );
    }
    if (stockEmpty) {
      responseCheckListStock = responseCheckListStock.filter(
        (item) => item.quantity - item.quantity_of <= 1
      );
    }

    setListaStock(responseCheckListStock);
  }, [checked, descricao, selectFornecedor, stockEmpty, stocks]);

  useEffect(() => {
    setListaStock(stocks);
  }, [stocks]);

  useEffect(() => {
    setValorTotalCompra(
      listaStock.reduce((acc, item) => {
        return acc + item.purchase_price * (item.quantity - item.quantity_of);
      }, 0.0)
    );
  }, [listaStock]);
  useEffect(() => {
    setValorTotalVenda(
      listaStock.reduce(
        (acc, item) =>
          acc + item.sale_value * (item.quantity - item.quantity_of),
        0.0
      )
    );
  }, [listaStock]);

  useEffect(() => {
    if (!checked) {
      setSelectFornecedor("");
      setListaStock([]);
      setStockEmpty(false);
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
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    checked={stockEmpty}
                    onChange={(e) => setStockEmpty(e.target.checked)}
                    id="checkStockEmpty"
                  />
                  <label className="custom-control-label" htmlFor="checkStockEmpty">
                    Produtos Esgotado?
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="selectFornecedor">Fornecedor</label>
                <select
                  id="selectFornecedor"
                  className="form-control"
                  value={selectFornecedor}
                  onChange={(event) => setSelectFornecedor(event.target.value)}
                >
                  <option value="">Selecione...</option>
                  {fornecedores.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.nickname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="from-group">
                <label htmlFor="inputDescricao">Produto</label>
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    id="inputDescricao"
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setDescricao("")}
                    >
                      X
                    </button>
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
            <p className="h2 text-center m-4">Relatorio de Estoque</p>

            <SearchFornecedores search={selectFornecedor} list={fornecedores} />

            <div className="mt-3">
              <BootstrapDataTable
                keyField="id"
                pagination={false}
                search={false}
                exportCSV={false}
                data={listaStock}
                trClassName={rowClassCheckFormat}
              >
                <TableHeaderColumn dataField="id" width="8%" dataSort>
                  #
                </TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataSort>
                  Descrição
                </TableHeaderColumn>
                <TableHeaderColumn dataField="unit" width="8%">
                  Und.
                </TableHeaderColumn>
                <TableHeaderColumn dataField="quantity" width="7%">
                  Qt.
                </TableHeaderColumn>
                <TableHeaderColumn dataField="quantity_of" width="8%">
                  Qt_of.
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="purchase_price"
                  dataSort
                  width="12%"
                  dataFormat={priceFormatter}
                >
                  Vl_Compra
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="sale_value"
                  dataSort
                  width="10%"
                  dataFormat={priceFormatter}
                >
                  Vl_Venda
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
              <p className="h4">
                Valor de Venda: <NumberFormat value={valorTotalVenda} />
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

function SearchFornecedores(props) {
  const { search, list } = props;

  const [result] = list.filter((item) => item.id === Number(search));

  if (!result) return "";
  return (
    <div>
      <p> Fornecedor: {result.nickname}</p>
      <p> Fone: {result.telephone}</p>
      <p> Email: {result.email}</p>
    </div>
  );
}
