import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import {
  BsListUl as IconList,
  BsTrashFill as IconRemoveList,
} from "react-icons/bs";
import { TableHeaderColumn } from "react-bootstrap-table";

import api from "../../server/api";
import ModalCenterBootstrapTable from "../../components/ModalCenterBootstrapTable";
import InputFormControl from "../../components/bootstrap/InputFormControl";
import InputNumberFormat from "../../components/bootstrap/InputNumberFormat";
import NumberFormat from "../../components/NumberFormat";
import NavBarVenda from "../../components/NavBarVenda";
import BootstrapDataTable from "../../components/bootstrap/DataTable";
import {
  numberFormatter,
  priceFormatter,
} from "../../utils/react-bootstrap-table-formatted";

export default () => {
  const history = useHistory();

  const [modalShowProduto, setModalShowProduto] = React.useState(false);
  const [modalShowCliente, setModalShowCliente] = React.useState(false);

  const [produtos, setProdutos] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState({});

  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState({});

  const [quantidade, setQuantidade] = useState({
    value: "1",
    formattedValue: "1",
    floatValue: 1,
  });
  const [listaPedido, setListaPedido] = useState([]);
  const [data, setData] = useState();
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    setData(new Date().toISOString().substring(0, 10));
  }, []);

  useEffect(() => {
    api
      .get("/stock")
      .then((response) => {
        const serializeStock = response.data.stocks.filter(
          (item) => item.sale_amount < item.quantity_purchase
        );
        setProdutos(serializeStock);
      })
      .catch((error) => {
        toast.error("Erro ao acessar API");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/client");
      setClientes(response.data.clients);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const total = listaPedido.reduce((acc, item) => acc + item.amount, 0);
    setValorTotal(total);
  }, [listaPedido]);

  const handleAdicionar = useCallback(() => {
    if (!selectedProduto.description) {
      toast.warning(
        "Selecione um produto e confira a quantidade antes de adicionar a lista."
      );
      return;
    }

    const pedido = {
      index: listaPedido.length + 1,
      stock: selectedProduto,
      description: selectedProduto.description,
      quantity: quantidade.floatValue,
      sale_value: selectedProduto.sale_value,
      amount: parseFloat(
        (selectedProduto.sale_value * quantidade.floatValue).toFixed(2)
      ),
    };

    let flagRepetido = false;
    listaPedido.forEach((item) => {
      if (item.stock === pedido.stock) {
        flagRepetido = true;
      }
    });

    if(flagRepetido) {
      toast.warning('Este item já esta na lista de pedidos')
    } else {
      setListaPedido([pedido, ...listaPedido]);
    }

    setSelectedProduto({});
    setQuantidade({
      value: "1",
      formattedValue: "1",
      floatValue: 1,
    });
  }, [listaPedido, quantidade.floatValue, selectedProduto]);

  const handleSelectedProduto = useCallback((row, isSelected) => {
    setSelectedProduto(row);
    const estoque = parseFloat(row.quantity_purchase - row.sale_amount);
    setQuantidade({
      formattedValue: estoque,
      floatValue: parseFloat(estoque),
      value: parseFloat(estoque),
    });
  }, []);

  const handleSelectedCliente = useCallback((row, isSelected) => {
    setSelectedCliente(row);
  }, []);

  const handleFinalizarPedido = useCallback(async () => {
    const orcamento = {
      client: selectedCliente,
      created_at: data,
      amount: valorTotal,
      wish_list: listaPedido,
    };
    const response = await api.post("/budget", orcamento);

    if (response.status === 200) {
      toast.success(response.data.message);
      history.push(`/venda/fechamentodevenda/${response.data.id}`);
    } else {
      toast.error(response.data.message);
      return;
    }
  }, [data, history, listaPedido, selectedCliente, valorTotal]);

  return (
    <div className="container-fluid">
      <NavBarVenda
        title="Ponto de Venda"
        quantidadeDeItens={listaPedido.length}
        valorTotal={<NumberFormat value={valorTotal} />}
      />

      <div className="row">
        <div className="col-3">
          <form>
            <InputFormControl
              label="Data"
              type="date"
              id="inputData"
              name="inputData"
              defaultValue={data}
              onChange={(event) => setData(event.target.value)}
            />

            <InputFormControl
              label="Produto"
              id="inputProduto"
              name="inputProduto"
              value={selectedProduto.description || ""}
              readOnly
            >
              <Button
                variant="secondary"
                onClick={() => setModalShowProduto(true)}
              >
                <IconList size="22px" title="Pesquisar Produto" />
              </Button>
            </InputFormControl>

            <ModalCenterBootstrapTable
              title="Lista de Produtos"
              show={modalShowProduto}
              data={produtos}
              onSelected={handleSelectedProduto}
              onHide={() => setModalShowProduto(false)}
            >
              <TableHeaderColumn dataField="id" isKey width="10%">
                #
              </TableHeaderColumn>
              <TableHeaderColumn dataField="description">
                Descrição
              </TableHeaderColumn>
              <TableHeaderColumn dataField="detail" width="20%">
                Detahe
              </TableHeaderColumn>
            </ModalCenterBootstrapTable>

            <InputNumberFormat
              label="Quantidade"
              id="inputQuantidade"
              name="inputQuantidade"
              prefix=""
              value={quantidade.formattedValue}
              onValueChange={(values) => setQuantidade(values)}
            />
          </form>
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
                value={selectedProduto.sale_value * quantidade.floatValue || 0}
              />
            </h2>
          </div>
          <div className="d-flex justify-content-end">
            <Button variant="success" onClick={handleAdicionar}>
              Adicionar
            </Button>
          </div>

          {listaPedido.length === 0 || !selectedCliente.name || (
            <div className="btn-group d-flex justify-content-end mt-5">
              <Button variant="primary" onClick={handleFinalizarPedido}>
                Finalizar o Pedido
              </Button>
            </div>
          )}
        </div>

        <div className="col-9">
          <InputFormControl
            label="Cliente"
            id="inputCliente"
            name="inputCliente"
            value={selectedCliente.name || ""}
            readOnly
          >
            <Button
              variant="secondary"
              className="px-4"
              onClick={() => setModalShowCliente(true)}
            >
              <IconList size="22px" title="Pesquisar Cliente" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => history.push("/cliente/register")}
            >
              Criar
            </Button>
          </InputFormControl>

          <ModalCenterBootstrapTable
            title="Lista de Clientes"
            show={modalShowCliente}
            data={clientes}
            onSelected={handleSelectedCliente}
            onHide={() => setModalShowCliente(false)}
          >
            <TableHeaderColumn dataField="id" isKey width="10%">
              #
            </TableHeaderColumn>
            <TableHeaderColumn dataField="name">Nome</TableHeaderColumn>
            <TableHeaderColumn dataField="cpf" width="30%">
              CPF/CNPJ
            </TableHeaderColumn>
          </ModalCenterBootstrapTable>

          <BootstrapDataTable
            data={listaPedido}
            pagination={false}
            search={false}
            exportCSV={false}
          >
            <TableHeaderColumn
              dataField="index"
              width="5%"
              isKey
              dataFormat={(cell, row) => (
                <Button
                  variant="danger"
                  onClick={() =>
                    setListaPedido(
                      listaPedido.filter((pedido) => pedido !== row)
                    )
                  }
                >
                  <IconRemoveList title="Revomer produto da lista" />
                </Button>
              )}
            >
              #
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
