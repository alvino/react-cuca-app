import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../components/patterns/DataTable";
import api from "../../services/api";
import InputFormControl from "../../components/InputFormControl";
import InputNumberFormat from "../../components/InputNumberFormat";
import NumberFormat from "../../components/NumberFormat";
import DateFormat from "../../components/DateFormat";
import SelectFormControl from "../../components/SelectFormControl";
import NavBarVenda from "../../components/patterns/NavBarVenda";
import {
  priceFormatter,
  numberFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import isObjectEmpty from "../../utils/isObjectEmpty";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [orcamento, setOrcamento] = useState({});
  const [cliente, setCliente] = useState({ name: "" });
  const [listaPedido, setListaPedido] = useState([]);

  const [valorTotal, setValorTotal] = useState(0.0);

  const [desconto, setDesconto] = useState({ value: 0, floatValue: 0 });
  const [entrada, setEntrada] = useState({ value: 0, floatValue: 0 });
  const [selectedPagamento, setSelectedPagamento] = useState("A vista");
  const [parcelas, setParcelas] = useState(30);

  useEffect(() => {
    if (id === "0") return;

    async function fetch() {
      const response_budget = await api.get(`budget/${id}`);
      const { budget } = response_budget.data;

      setOrcamento(budget);
    }

    fetch();
  }, [id]);

  useEffect(() => {
    if (isObjectEmpty(orcamento)) return;

    async function fetch() {
      const response = await api.get(`requested_budget/${orcamento.id}`);
      const { requested_budgets } = response.data;

      const serializedRequestedBudget = requested_budgets.map(
        (item, index) => ({
          index,
          ...item,
        })
      );

      setListaPedido(serializedRequestedBudget);
    }

    fetch();
  }, [orcamento]);

  useEffect(() => {
    if (isObjectEmpty(orcamento)) return;

    async function fetch() {
      const response_client = await api.get(`client/${orcamento.client_id}`);
      const { client } = response_client.data;

      setCliente(client);
    }

    fetch();
  }, [orcamento]);

  useEffect(() => {
    const total = listaPedido.reduce((acc, item) => acc + item.amount, 0);
    setValorTotal(total);
  }, [listaPedido]);

  useEffect(() => {
    if (selectedPagamento === "A vista") {
      setParcelas(30);
      setEntrada({ value: 0, floatValue: 0 });
    }
  }, [selectedPagamento]);

  const handlerOnValueChangeDesconto = useCallback((values) => {
    if (values.formattedValue === "") values = { value: 0, floatValue: 0 };
    setDesconto(values);
  }, []);

  const handleConfirmarConclusaoVenda = useCallback(async () => {
    let sales = [];
    let multiplicador = parcelas / 30;
    let [ano, mes, dia] = new Date()
      .toISOString()
      .substring(0, 10)
      .split("-")
      .map((item) => parseInt(item));
    mes--;

    const description = cliente.name;

    const valor_venda = parseFloat(
      (
        (valorTotal - (desconto.floatValue + entrada.floatValue)) /
        (parcelas / 30)
      ).toFixed(2)
    );

    let index = 0;

    if (entrada.floatValue) {
      const description = `${cliente.name} - entrada`;

      multiplicador++;
      index++;

      sales.push({
        budget_id: id,
        description,
        amount: entrada.floatValue,
        all_parcel: multiplicador,
        parcel: index,
        date_sale: new Date(ano, mes, dia).toISOString().substring(0, 10),
      });
    }

    mes = selectedPagamento === "A prazo" ? ++mes : mes;

    while (index < multiplicador) {
      index++;

      sales.push({
        budget_id: id,
        description,
        amount: valor_venda,
        all_parcel: multiplicador,
        parcel: index,
        date_sale: new Date(ano, mes, dia).toISOString().substring(0, 10),
      });

      mes++;
    }

    const resposta = await api.post("sale", sales);

    if (resposta.status >= 500) {
      toast.error("erro interno no servidor ao finalizar venda");
    } else {
      toast.success("venda finalizada sucesso");
      history.push("/venda");
    }
  }, [
    cliente,
    desconto.floatValue,
    entrada.floatValue,
    history,
    id,
    parcelas,
    selectedPagamento,
    valorTotal,
  ]);

  return (
    <div className="container-fluid">
      <NavBarVenda
        title="Finalizar Venda"
        quantidadeDeItens={listaPedido.length}
        valorTotal={
          selectedPagamento === "A vista" ? (
            <NumberFormat value={valorTotal} />
          ) : (
            <div>
              <span>{parcelas} X </span>{" "}
              <NumberFormat
                value={parseFloat(
                  (
                    (valorTotal - (desconto.floatValue + entrada.floatValue)) /
                    (parcelas / 30)
                  ).toFixed(2)
                )}
              />
            </div>
          )
        }
      />

      <div className="row">
        <div className="col-3">
          <InputNumberFormat
            label="Desconto"
            id="inputDesconto"
            name="inputDesconto"
            value={desconto.formattedValue}
            onValueChange={handlerOnValueChangeDesconto}
          />

          <SelectFormControl
            label="Pagamento"
            id="selectPagamento"
            name="selectPagamento"
            value={selectedPagamento}
            onChange={(event) => setSelectedPagamento(event.target.value)}
          >
            <option key={0} >A vista</option>
            <option key={1} >A prazo</option>
          </SelectFormControl>
          {selectedPagamento === "A prazo" && (
            <>
              <InputFormControl
                label="Parcelas"
                type="Number"
                id="inputParcelas"
                name="inputParcelas"
                min="30"
                max="120"
                step="30"
                value={parcelas}
                onChange={(event) => setParcelas(event.target.value)}
              />
              <InputNumberFormat
                label="Entrada"
                id="inputEntrada"
                name="inputEntrada"
                value={entrada.formattedValue}
                onValueChange={(values) => setEntrada(values)}
              />
            </>
          )}

          <button
            className="btn btn-primary"
            onClick={handleConfirmarConclusaoVenda}
          >
            Confirmar Conclusão da Venda
          </button>
        </div>
        <div className="col-9">
          <button
            className="btn btn-success m-2"
            onClick={() => history.push(`/orcamento/print/${id}`)}
          >
            Imprimir Orcamento
          </button>

          <p className="text-right">
            <DateFormat value={String(orcamento.created_at)} />
          </p>

          <p className="font-weight-bold text-uppercase mb-2">
            Cliente: {cliente.name}
          </p>
          <p className="text-right">
            Valor Total:
            <NumberFormat
              value={parseFloat(
                (
                  valorTotal -
                  (desconto.floatValue + entrada.floatValue)
                ).toFixed(2)
              )}
            />
          </p>
          <p className="text-right">
            Desconto: <NumberFormat value={desconto.floatValue || 0} />
          </p>
          {selectedPagamento === "A prazo" && (
            <p className="text-right">
              Entrada: <NumberFormat value={entrada.floatValue || 0} />
            </p>
          )}

          <div className="mt-3">
            <BootstrapDataTable
              data={listaPedido}
              pagination={false}
              search={false}
              exportCSV={false}
            >
              <TableHeaderColumn dataField="index" isKey width="5%">
                #
              </TableHeaderColumn>
              <TableHeaderColumn dataField="description">
                Descrição
              </TableHeaderColumn>
              <TableHeaderColumn dataField="detail">Detalhe</TableHeaderColumn>
              <TableHeaderColumn
                dataField="quantity"
                width="10%"
                dataFormat={numberFormatter}
              >
                Quant.
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
    </div>
  );
};
