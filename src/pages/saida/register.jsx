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
  const [selected, setSelected] = useState("");
  const [multiplicador, setMultiplicador] = useState(1);

  const [outlays, setOutlays] = useState([]);

  useEffect(() => {
    setData(new Date().toISOString().substring(0, 10));
  }, []);

  useEffect(() => {
    if (valor && descricao) {
      let outlays = [];

      const valor_gasto = valor.floatValue;
      let [ano, mes, dia] = data.split("-").map((item) => parseInt(item));
      mes--;
      let index = 0;
      do {
        index++;
        outlays.push({
          index,
          description: descricao,
          amount: valor_gasto,
          date_outlay: new Date(ano, mes, dia).toISOString().substring(0, 10),
        });
        mes++;
      } while (index < multiplicador);
      setOutlays(outlays);
    }
  }, [data, valor, descricao, multiplicador]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const serielizedOutlay = outlays.map((item) => {
        const { index, ...outlay } = item;
        return outlay;
      });
      const resposta = await api.post("/outlay", serielizedOutlay);
      if (resposta.status === 200) {
        toast.success(resposta.data.message);
        history.goBack();
      } else {
        toast.error(resposta.data.message);
      }
    },
    [history, outlays]
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
              label="Vezes"
              id="selectedPagamento"
              name="selectedPagamento"
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
            >
              <option>Uma vez</option>
              <option>Varias vezes</option>
            </SelectFormControl>
            {selected === "Varias vezes" ? (
              <InputFormControl
                label="Multiplicador"
                type="Number"
                id="inputParcelas"
                name="inputParcelas"
                min="1"
                value={multiplicador}
                onChange={(event) => setMultiplicador(event.target.value)}
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
          <BootstrapTable bootstrap4 data={outlays} keyField="index">
            <TableHeaderColumn dataField="index"  width="5%">
              #
            </TableHeaderColumn>
            <TableHeaderColumn dataField="description">
              Descrição
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="amount"
              width="15%"
              dataFormat={priceFormatter}
            >
              Valor
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="date_outlay"
              width="15%"
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
