import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next'

import InputFormControl from "../../components/bootstrap/InputFormControl";
import InputNumberFormat from "../../components/bootstrap/InputNumberFormat";
import SelectFormControl from "../../components/bootstrap/SelectFormControl";
import api from "../../server/api";
import {priceFormatter, dateFormatter} from '../../utils/react-bootstrap-table-formatted'


const columns = [
  {dataField: 'index', text: '#', headerStyle: {width: '5%'}},
  {dataField: 'description', text: 'Descrição'},
  {dataField: 'parcel', text: 'De', headerStyle: {width: '5%'}},
  {dataField: 'all_parcel', text: 'Parc.',headerStyle: {width: '5%'}},
  {dataField: 'amount', text: 'Valor', formatter: priceFormatter, headerStyle: {width: '10%'}},
  {dataField: 'date_sale', text: 'Data', formatter: dateFormatter, headerStyle: {width: '10%'}},
]


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

  async function handleSubmit(event) {
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
                className="form-control form-control-lg"
                id="inputParcelas"
                name="inputParcelas"
                min="1"
                value={parcelas}
                onChange={(event) => setParcelas(event.target.value)}
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
          bootstrap4={true} 
          keyField='index'
          data={sales} 
          columns={columns}
          />
            
        </div>
      </div>
    </>
  );
};
