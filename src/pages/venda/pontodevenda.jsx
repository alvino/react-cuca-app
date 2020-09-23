import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { TableHeaderColumn } from "react-bootstrap-table";

import api from "../../services/api";
import ModalCenterBootstrapTable from "../../components/patterns/ModalCenterBootstrapTable";
import InputFormControl from "../../components/InputFormControl";
import InputNumberFormat from "../../components/InputNumberFormat";
import NumberFormat from "../../components/NumberFormat";
import NavBarVenda from "../../components/patterns/NavBarVenda";
import BootstrapDataTable from "../../components/patterns/DataTable";
import {
  numberFormatter,
  priceFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import isEmpetyObject from "../../utils/isEmptyObject";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [orcamento, setOrcamento] = useState({});

  const [dataProdutos, setDataProdutos] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState({});

  const [cliente, setCliente] = useState([]);

  const [quantidade, setQuantidade] = useState({
    value: "1",
    formattedValue: "1",
    floatValue: 1,
  });
  const [listaPedido, setListaPedido] = useState([]);
  const [data, setData] = useState();
  const [valorTotal, setValorTotal] = useState(0);

  const [isSelected, setIsSelect] = useState(false);
  const [rowSelect, setRowSelect] = useState({});

  useEffect(() => {
    if (id === "0") return;

    async function fetch() {
      const response_budget = await api.get(`budget/${id}`);
      const { budget } = response_budget.data;
      setOrcamento(budget);
      setData(budget.created_at);
    }

    fetch();
  }, [id]);

  useEffect(() => {
    if (isEmpetyObject(orcamento)) return;

    async function fetch() {
      const response = await api.get(`requested_budget/${orcamento.id}`);
      const { requested_budgets } = response.data;
      setListaPedido(requested_budgets);
    }

    fetch();
  }, [orcamento]);

  useEffect(() => {
    if (isEmpetyObject(orcamento) ) return;

    async function fetch() {
      const response_client = await api.get(`client/${orcamento.client_id}`);
      const { client } = response_client.data;
      setCliente(client);
    }

    fetch();
  }, [orcamento]);

  useEffect(() => {
    setData(new Date().toISOString().substring(0, 10));
  }, []);

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get("/stock");
        const serializeStock = response.data.stocks.filter(
          (item) => item.quantity_of < item.quantity
        );
        setDataProdutos(serializeStock);
      } catch (error) {
        toast.error("Erro ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    const total = listaPedido.reduce((acc, item) => acc + item.amount, 0);
    setValorTotal(total);
  }, [listaPedido]);

  useEffect(() => {
    if (!isSelected) return;

    async function fetch() {
      const response = await api.get(`stock/${rowSelect.stock_id}`);
      const { stock } = response.data;
      setSelectedProduto(stock);
      setQuantidade({
        value: String(rowSelect.quantity),
        formattedValue: String(rowSelect.quantity).replace(".", ","),
        floatValue: rowSelect.quantity,
      });
    }
    fetch();
  }, [isSelected, rowSelect]);

  const handleInciaCamposListaProduto = useCallback(() => {
    setSelectedProduto({});
    setQuantidade({
      value: "1",
      formattedValue: "1",
      floatValue: 1,
    });
    setRowSelect({});
    setIsSelect(false);
  }, []);

  const handleRemover = useCallback(async () => {
    try {
      const newListaPedido = listaPedido.filter((item) => item !== rowSelect);
      await api.delete(`requested_budget/${rowSelect.id}`);
      setListaPedido(newListaPedido);
      handleInciaCamposListaProduto();
    } catch (error) {
      console.error(error);
    }
  }, [handleInciaCamposListaProduto, listaPedido, rowSelect]);

  const handleAdicionar = useCallback(async () => {
    if (!selectedProduto.description) {
      toast.warning(
        "Selecione um produto e confira a quantidade antes de adicionar a lista."
      );
      return;
    }

    let newPedido = {};

    if (isSelected) {
      newPedido = {
        ...rowSelect,
        sale_value: selectedProduto.sale_value,
        amount: parseFloat(
          (selectedProduto.sale_value * quantidade.floatValue).toFixed(2)
        ),
        quantity: quantidade.floatValue,
      };
    } else {
      newPedido = {
        budget_id: id,
        created_at: data,
        description: selectedProduto.description,
        detail: selectedProduto.detail,
        stock_id: selectedProduto.id,
        sale_value: selectedProduto.sale_value,
        stock: selectedProduto.quantity - selectedProduto.quantity_of,
        amount: parseFloat(
          (selectedProduto.sale_value * quantidade.floatValue).toFixed(2)
        ),
        quantity: quantidade.floatValue,
      };
    }

    if (listaPedido.includes(rowSelect)) {
      const newListaPedido = listaPedido.filter((item) => item !== rowSelect);

      try {
        const { id, amount, quantity } = newPedido;
        await api.put(`requested_budget/${id}`, {
          amount,
          quantity,
        });
        newListaPedido.push(newPedido);
        setListaPedido(newListaPedido);
      } catch (error) {
        console.error(error);
      }
    } else {
      if (
        listaPedido.find((produto) => produto.stock_id === newPedido.stock_id)
      ) {
        toast.info("Este produto já esta na lista de pedidos");
        handleInciaCamposListaProduto();
        return;
      }

      try {
        const { budget_id, stock_id, amount, quantity } = newPedido;
        await api.post(`requested_budget`, {
          budget_id,
          stock_id,
          amount,
          quantity,
        });
        setListaPedido([...listaPedido, newPedido]);
      } catch (error) {
        console.error(error);
      }
    }

    handleInciaCamposListaProduto();
  }, [
    selectedProduto.description,
    selectedProduto.quantity,
    selectedProduto.quantity_of,
    selectedProduto.sale_value,
    selectedProduto.detail,
    selectedProduto.id,
    quantidade.floatValue,
    isSelected,
    listaPedido,
    rowSelect,
    handleInciaCamposListaProduto,
    id,
    data,
  ]);

  const handleSelectedProduto = useCallback((row) => {
    setSelectedProduto(row);
    const estoque = parseFloat(row.quantity - row.quantity_of);
    setQuantidade({
      formattedValue: estoque,
      floatValue: parseFloat(estoque),
      value: parseFloat(estoque),
    });
  }, []);

  const onSelect = useCallback(async (row, isSelected) => {
    setRowSelect(row);
    setIsSelect(isSelected);
  }, []);

  const handleFinalizarPedido = useCallback(async () => {
    if (listaPedido.find((item) => item.stock - item.quantity < 0)) {
      toast.warning("Remova os itens em vermelho para continuar");
      return;
    }

    const amount = parseFloat(valorTotal.toFixed(2));

    const response = await api.put(`budget/${orcamento.id}`, {
      ...orcamento,
      amount,
    });

    if (response.status === 200) {
      toast.success(response.data.message);
      history.push(`/venda/fechamentodevenda/${id}`);
    } else {
      toast.error(response.data.message);
      return;
    }
  }, [history, id, listaPedido, orcamento, valorTotal]);

  const rowClassCheckFormat = (row, rowIdx) => {
    if (row.stock - row.quantity < 0) return "bg-danger text-white";
  };

  return (
    <div className="container-fluid">
      <NavBarVenda
        title="Ponto de Venda"
        quantidadeDeItens={listaPedido.length}
        valorTotal={<NumberFormat value={valorTotal} />}
      >
        <span>{cliente.name}</span>
      </NavBarVenda>

      <div className="row">
        <div className="col-4">
          <InputFormControl
            label="Data"
            type="date"
            id="inputData"
            name="inputData"
            defaultValue={data}
            onChange={(event) => setData(event.target.value)}
          />

          {orcamento && (
            <>
              <InputFormControl
                label="Produto"
                id="inputProduto"
                name="inputProduto"
                value={selectedProduto.description || ""}
                readOnly
              >
                <ModalCenterBootstrapTable
                  title="Lista de Produtos"
                  data={dataProdutos}
                  onSelected={handleSelectedProduto}
                  disable={isSelected}
                >
                  <TableHeaderColumn dataField="id" isKey width="10%">
                    #
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="description">
                    Descrição
                  </TableHeaderColumn>
                  <TableHeaderColumn dataField="unit">Und.</TableHeaderColumn>
                  <TableHeaderColumn dataField="detail" width="20%">
                    Detalhe
                  </TableHeaderColumn>
                </ModalCenterBootstrapTable>
              </InputFormControl>

              <InputNumberFormat
                label="Quantidade"
                id="inputQuantidade"
                name="inputQuantidade"
                prefix=""
                value={quantidade.formattedValue}
                onValueChange={(values) => setQuantidade(values)}
              />
              <div className="row justify-content-between p-3">
                <label>Valor Unit.</label>
                <h3 className="text-muted">
                  <NumberFormat value={selectedProduto.sale_value || 0} />
                </h3>
              </div>
              <div className="row justify-content-between p-3">
                <label>Valor</label>
                <h2>
                  <NumberFormat
                    value={
                      selectedProduto.sale_value * quantidade.floatValue || 0
                    }
                  />
                </h2>
              </div>
              <div className="d-flex justify-content-end">
                <div className="btn-group " role="group">
                  <Button variant="success" onClick={handleAdicionar}>
                    Adicionar
                  </Button>
                  {isSelected && (
                    <>
                      <Button variant="danger" onClick={handleRemover}>
                        Remover
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleInciaCamposListaProduto}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {listaPedido.length === 0 || (
            <div className="btn-group d-flex justify-content-end mt-5">
              <Button variant="primary" onClick={handleFinalizarPedido}>
                Finalizar o Pedido
              </Button>
            </div>
          )}
        </div>

        <div className="col-8">
          <BootstrapDataTable
            data={listaPedido}
            pagination={false}
            search={false}
            exportCSV={false}
            onSelect={null}
            onRowClick={onSelect}
            trClassName={rowClassCheckFormat}
          >
            <TableHeaderColumn isKey dataField="stock_id" width="8%">
              Cod.
            </TableHeaderColumn>
            <TableHeaderColumn dataField="description">
              Produto (descrição)
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="quantity"
              width="10%"
              dataFormat={numberFormatter}
            >
              Qt.
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="sale_value"
              width="15%"
              dataFormat={priceFormatter}
            >
              Valor Unit.
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="amount"
              width="15%"
              dataFormat={priceFormatter}
            >
              Valor Total
            </TableHeaderColumn>
          </BootstrapDataTable>
        </div>
      </div>
    </div>
  );
};
