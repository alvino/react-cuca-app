import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import InputFormControl from "../../components/bootstrap/InputFormControl";
import InputNumberFormat from "../../components/bootstrap/InputNumberFormat";
import SelectFormControl from "../../components/bootstrap/SelectFormControl";
import api from "../../server/api";
import {priceFormatter, dateFormatter} from '../../utils/react-bootstrap-table-formatted'


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

  async function handleSubmit(event) {
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
  }

  return (
    <>
      <div className="row p-3">
        <Button
          variant="secondary"
          size="lg"
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
              className="form-control form-control-lg"
              type="date"
              id="inputData"
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
              className="form-control form-control-lg"
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
                className="form-control form-control-lg"
                id="inputParcelas"
                name="inputParcelas"
                min="1"
                value={multiplicador}
                onChange={(event) => setMultiplicador(event.target.value)}
              />
            ) : (
              ""
            )}

            <Button variant="primary" size="lg" onClick={handleSubmit}>
              {" "}
              Salvar Cadastro{" "}
            </Button>
          </Form>
        </div>
        <div className="col-9">
          <BootstrapTable
            version="4"
            data={outlays}
            pagination
            ignoreSinglePage
          >
            <TableHeaderColumn dataField="index" width="5%">
              #
            </TableHeaderColumn>
            <TableHeaderColumn dataField="description" dataSort>
              Descrição
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField="amount"
              dataSort
              dataFormat={priceFormatter}
              width="15%"
            >
              Valor
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="date_outlay"
              dataSort
              dataFormat={dateFormatter}
              width="15%"
              isKey={true}
            >
              Data
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
      </div>
    </>
  );
};