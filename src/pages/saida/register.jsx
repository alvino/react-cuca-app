import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../components/patterns/DataTable";
import InputFormControl from "../../components/InputFormControl";
import InputNumberFormat from "../../components/InputNumberFormat";
import SelectFormControl from "../../components/SelectFormControl";
import api from "../../services/api";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";


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
      if (resposta.status >= 500) {
        toast.error('erro interno no servidor ao cadastrar gasto');
      } else {
        toast.success('gasto cadastrado com sucesso');
        history.goBack();
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
            {selected === "Varias vezes" && (
              <InputFormControl
                label="Multiplicador"
                type="Number"
                id="inputParcelas"
                name="inputParcelas"
                min="1"
                value={multiplicador}
                onChange={(event) => setMultiplicador(event.target.value)}
              />
            ) }

            <Button variant="primary" onClick={handleSubmit}>
              
              Salvar Cadastro
            </Button>
          </Form>
        </div>
        <div className="col-9">
          <BootstrapDataTable  data={outlays} >
            <TableHeaderColumn dataField="index" isKey width="5%">
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
          </BootstrapDataTable>
        </div>
      </div>
    </>
  );
};
