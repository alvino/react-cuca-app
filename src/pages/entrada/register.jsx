import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";

import InputFormControl from "../../components/bootstrap/InputFormControl";
import InputNumberFormat from "../../components/bootstrap/InputNumberFormat";
import SelectFormControl from "../../components/bootstrap/SelectFormControl";
import api from "../../server/api";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import { useCallback } from "react";
import { TableHeaderColumn } from "react-bootstrap-table";

export default () => {
  const history = useHistory();

  const [data, setData] = useState();
  const [valor, setValor] = useState({ floatValue: 0 });
  const [descricao, setDescricao] = useState("");
  const [selectedPagamento, setSelectedPagamento] = useState("A vista");
  const [parcelas, setParcelas] = useState(1);

  const [sales, setSales] = useState([]);

  useEffect(() => {
    setData(new Date().toISOString().substring(0, 10));
  }, []);

  useEffect(() => {
    if (valor.floatValue && descricao) {
      let sales = [];
      const valor_venda = valor.floatValue;
      let [ano, mes, dia] = data.split("-").map((item) => parseInt(item));
      mes--;
      const valor_parcelas = parseFloat((valor_venda / parcelas).toFixed(2));

      let index = 0;
      do {
        index++;
        sales.push({
          index,
          description: descricao,
          amount: valor_parcelas,
          all_parcel: parcelas,
          parcel: index,
          date_sale: new Date(ano, mes, dia).toISOString().substring(0, 10),
        });
        mes++;
      } while (index < parcelas);

      setSales(sales);
    }
  }, [data, valor, descricao, selectedPagamento, parcelas]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const serializedSale = sales.map((item) => {
        const { index, ...sale } = item;
        return sale;
      });

      const resposta = await api.post("/sale", serializedSale);

      if (resposta.status === 200) {
        toast.success(resposta.data.message);
        history.goBack();
      } else {
        toast.error(resposta.data.message);
      }
    },
    [history, sales]
  );

  return (
    <>
      <div className="row p-3">
        <Button
          variant="secondary"
          className="mb-4"
          onClick={() => history.goBack()}
        >
          Voltar
        </Button>
      </div>
      <div className="row">
        <div className="col-3">
          <Form>
            <InputFormControl
              label="Data"
              type="date"
              id="inputData"
              name="inputData"
              value={data}
              onChange={(event) => setData(event.target.value)}
            />

            <InputFormControl
              label="Descrição"
              id="inputDescricao"
              name="inputDescricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
            />

            <InputNumberFormat
              label="Valor"
              id="inputValor"
              name="inputValor"
              value={valor.formattedValue}
              onValueChange={(values) => setValor(values)}
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
              <InputFormControl
                label="Parcelas"
                type="Number"
                id="inputParcelas"
                name="inputParcelas"
                min="1"
                value={parcelas}
                onChange={(event) => setParcelas(event.target.value)}
              />
            ) : (
              ""
            )}

            <Button variant="primary" onClick={handleSubmit}>
              {" "}
              Salvar Cadastro{" "}
            </Button>
          </Form>
        </div>

        <div className="col-9">
          <BootstrapTable data={sales}>
            <TableHeaderColumn dataField="index" width="5%">
              #
            </TableHeaderColumn>
            <TableHeaderColumn dataField="description">
              Descrição
            </TableHeaderColumn>
            <TableHeaderColumn dataField="parcel" width="5%">
              De
            </TableHeaderColumn>
            <TableHeaderColumn dataField="all_parcel" width="5%">
              Parc.
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="amount"
              width="10%"
              dataFormat={priceFormatter}
            >
              Valor
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="date_sale"
              width="10%"
              dataFormat={dateFormatter}
            >
              Data
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    </>
  );
};
