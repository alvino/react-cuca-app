import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../components/bootstrap/DataTable";
import api from "../../server/api";
import InputFormControl from "../../components/bootstrap/InputFormControl";
import InputNumberFormat from "../../components/bootstrap/InputNumberFormat";
import NumberFormat from "../../components/NumberFormat";
import DateFormat from "../../components/DateFormat";
import SelectFormControl from "../../components/bootstrap/SelectFormControl";
import NavBarVenda from "../../components/NavBarVenda";
import {
  priceFormatter,
  numberFormatter,
} from "../../utils/react-bootstrap-table-formatted";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [orcamento, setOrcamento] = useState({});
  const [cliente, setCliente] = useState({});
  const [listaPedido, setListaPedido] = useState([]);

  const [desconto, setDesconto] = useState({ value: 0, floatValue: 0 });
  const [entrada, setEntrada] = useState({ value: 0, floatValue: 0 });
  const [selectedPagamento, setSelectedPagamento] = useState("A vista");
  const [parcelas, setParcelas] = useState(30);
  const [valorTotal, setValorTotal] = useState(0.0);

  useEffect(() => {
    api
      .get(`/budget/${id}`)
      .then((response) => {
        const serielizedListaPedido = response.data.wish_list.map(
          (item, index) => ({ index: index + 1, ...item })
        );

        setListaPedido(serielizedListaPedido);
        setOrcamento(response.data.budget);
        setCliente(response.data.client);
      })
      .catch((error) => {
        toast.error("Erro ao acessa API");
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    const dividendo = parcelas / 30;
    const montante =
      orcamento.amount - (desconto.floatValue + entrada.floatValue);
    setValorTotal(parseFloat((montante / dividendo).toFixed(2)));
  }, [id, desconto, entrada, parcelas, orcamento]);

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

  const handlerPushImprimir = () => {
    history.push(`/orcamento/print/${id}`);
  };

  const handleConfirmarConclusaoVenda = useCallback(async () => {
    let sales = [];
    let multiplicador = parcelas / 30;
    let [ano, mes, dia] = new Date()
      .toISOString()
      .substring(0, 10)
      .split("-")
      .map((item) => parseInt(item));
    mes--;

    let index = 0;

    if (entrada.floatValue) {
      const description = `${cliente.name} - entrada`;
      const valor_venda = entrada.floatValue;

      multiplicador++;
      index++;

      sales.push({
        budget_id: id,
        description,
        amount: valor_venda,
        all_parcel: multiplicador,
        parcel: index,
        date_sale: new Date(ano, mes, dia).toISOString().substring(0, 10),
      });
    }

    mes = selectedPagamento === "A prazo" ? ++mes : mes;

    while (index < multiplicador) {
      index++;

      const description = cliente.name;

      const valor_venda = parseFloat(valorTotal);

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

    const resposta = await api.post("/sale", sales);

    if (resposta.status === 200) {
      toast.success(resposta.data.message);
      history.goBack();
    } else {
      toast.error(resposta.data.message);
    }
  }, [
    cliente.name,
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
              <span>{parcelas} X </span> <NumberFormat value={valorTotal} />
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
            id="selectedPagamento"
            name="selectedPagamento"
            value={selectedPagamento}
            onChange={(event) => setSelectedPagamento(event.target.value)}
          >
            <option>A vista</option>
            <option>A prazo</option>
          </SelectFormControl>
          {selectedPagamento === "A prazo" ? (
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
          ) : (
            ""
          )}

          <Button variant="primary" onClick={handleConfirmarConclusaoVenda}>
            Confirmar Conclusão da Venda
          </Button>
        </div>
        <div className="col-9">
          <Button
            variant="success"
            className="m-2"
            onClick={handlerPushImprimir}
          >
            Imprimir Orcamento
          </Button>

          <p className="text-right">
            <DateFormat value={String(orcamento.created_at)} />
          </p>

          <p className="font-weight-bold text-uppercase mb-2">
            Cliente: {cliente.name}
          </p>
          <p className="text-right">
            Valor Total:
            <NumberFormat value={orcamento.amount - desconto.floatValue} />
          </p>
          <p className="text-right">
            Desconto: <NumberFormat value={desconto.floatValue || 0} />
          </p>
          {selectedPagamento === "A prazo" ? (
            <p className="text-right">
              Entrada: <NumberFormat value={entrada.floatValue || 0} />
            </p>
          ) : (
            ""
          )}

          <div className="mt-3">
            <BootstrapDataTable
              data={listaPedido}
              keyField="index"
              pagination={false}
              search={false}
              exportCSV={false}
            >
              <TableHeaderColumn dataField="index" width="5%">
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
