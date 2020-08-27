import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../server/api";
import { Button, Form, ToggleButton, ButtonGroup } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";


import InputFormControl from "../../../components/bootstrap/InputFormControl";
import SelectFormControl from "../../../components/bootstrap/SelectFormControl";
import NumberFormat from "../../../components/NumberFormat";
import {
  priceFormatter,
  dateFormatter,
} from "../../../utils/react-bootstrap-table-formatted";


import logoCuca from "../../../assert/logo_cuca.svg";
import "./style.css";

const columns = [
  {
    dataField: 'id', text: '#',
    headerStyle: {width: '5%'}
  },
  {
    dataField: 'description', text: 'Descrição',
  },
  {
    dataField: 'amount', text: 'Valor',
    headerStyle: {width: '15%'},
    formatter: priceFormatter,
  },
  {
    dataField: 'date_outlay', text: 'Data',
    headerStyle: {width: '15%'},
    formatter: dateFormatter
  },
]


export default () => {
  const history = useHistory();

  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [checked, setChecked] = useState(true);

  const [outlays, setOutlays] = useState([]);
  const [valorTotal, setValorTotal] = useState();

  useEffect(() => {
    async function fetchData() {
      let date_outlay = "";

      if (checked) {
        date_outlay = date_outlay + ano;
        date_outlay =
          mes === "" ? date_outlay : [date_outlay, mes, dia].join("-");
      }

      const query = {
        date_outlay,
      };

      const response = await api.get("/outlay", { params: query });
      setOutlays(response.data.outlays);
    }
    fetchData();
  }, [ano, mes, dia, checked]);

  useEffect(() => {
    if (outlays.heigth === 0) return;
    setValorTotal(outlays.reduce((acc, item) => acc + item.amount, 0.0));
  }, [outlays]);

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div>
      <div className="mb-5 noprint">
        <div className="btn-group mb-2" role="group">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => history.goBack()}
          >
            Voltar
          </Button>
          <Button size="lg" onClick={handleImprimir}>
            Imprimir
          </Button>
        </div>
        <div>
          <Form className="mt-2">
            <div className="row d-flex justify-content-start align-items-center">
              {checked ? (
                <>
                  <div className="col-2">
                    <InputFormControl
                      label="Ano"
                      type="Number"
                      id="inputAno"
                      name="inputAno"
                      value={ano}
                      onChange={(event) => setAno(event.target.value)}
                    />
                  </div>

                  <div className="col-2">
                    <SelectFormControl
                      label="Mês"
                      id="selectMes"
                      name="selectMes"
                      value={mes}
                      onChange={(event) => setMes(event.target.value)}
                    >
                      <option value="">Selecione um mes</option>
                      <option value="01">Janeiro</option>
                      <option value="02">Fevereiro</option>
                      <option value="03">Março</option>
                      <option value="04">Abril</option>
                      <option value="05">Maio</option>
                      <option value="06">Junho</option>
                      <option value="07">Julho</option>
                      <option value="08">Agosto</option>
                      <option value="09">Setembro</option>
                      <option value="10">Outubro</option>
                      <option value="11">Novembro</option>
                      <option value="12">Dezembro</option>
                    </SelectFormControl>
                  </div>

                  {mes !== "" ? (
                    <div className="col-2">
                      <SelectFormControl
                        label="Dia"
                        id="selectDia"
                        name="selectDia"
                        value={dia}
                        onChange={(event) => setDia(event.target.value)}
                      >
                        <option></option>
                        <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>13</option>
                        <option>14</option>
                        <option>15</option>
                        <option>16</option>
                        <option>17</option>
                        <option>18</option>
                        <option>19</option>
                        <option>20</option>
                        <option>21</option>
                        <option>22</option>
                        <option>23</option>
                        <option>24</option>
                        <option>25</option>
                        <option>26</option>
                        <option>27</option>
                        <option>28</option>
                        <option>29</option>
                        <option>30</option>
                        <option>31</option>
                      </SelectFormControl>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
              <div className="col-2">
                <ButtonGroup toggle>
                  <ToggleButton
                    type="checkbox"
                    variant="secondary"
                    checked={checked}
                    value="1"
                    onChange={(e) => setChecked(e.currentTarget.checked)}
                    size="lg"
                  >
                    {checked ? "Todos" : "Filtrar"}
                  </ToggleButton>
                </ButtonGroup>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div>
        <div className="print">
          <div
            className="bg-primary 
          d-flex-column 
          text-white d-flex 
          justify-content-between 
          align-items-center p-3"
          >
            <div className="justify-content-center">
              <div className="d-flex justify-content-center">
                <img src={logoCuca} height="100px" alt="logo" />
              </div>
            </div>
            <div className="text-center ml-2">
              <span className="h5 font-italic">Para Crescer,</span>
              <span className="h5 font-weight-bold"> Use a Cuca.</span>
            </div>

            <div>
              <div className="text-center">
                <span className="">MARKETING & PROPAGANDA</span>
              </div>
              <div className="text-center">
                <span className="">FOTOS & FILMAGENS</span>
              </div>
              <div className="text-center">
                <span className="h5 font-weight-bold">
                  CNPJ: 28.110.511/0001-85
                </span>
              </div>
            </div>
          </div>

          <div className=" mb-auto">
            <p className="h2 text-center m-4  ">
              Relatorio Gastos
              {checked
                ? ` - ${dia ? dia + "/" : dia}${mes ? mes + "/" : mes}${ano}`
                : ""}
            </p>

            <div className="mt-3">
              <p className="text-right font-weight-bold">
                <span className="h3">
                  <NumberFormat value={valorTotal} />
                </span>
              </p>
              <BootstrapTable 
              bootstrap4 
              data={outlays}
                keyField='id'
                columns={columns}
                />
               
            </div>
          </div>
        </div>

        <Button className="mt-5" size="lg" onClick={handleImprimir}>
          Imprimir
        </Button>
      </div>
    </div>
  );
};
