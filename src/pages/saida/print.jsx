import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, ToggleButton, ButtonGroup } from "react-bootstrap";
import BootstrapDataTable from "../../components/bootstrap/DataTable";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

import api from "../../server/api";
import InputFormControl from "../../components/bootstrap/InputFormControl";
import SelectFormControl, {
  OptionMeses,
  OptionDias,
} from "../../components/bootstrap/SelectFormControl";
import NumberFormat from "../../components/NumberFormat";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import { ButtonHandlePrint } from "../../components/bootstrap/Buttons";
import Cabecalho from '../../components/print/Cabecalho'

import Print from "../../styles/Print";

export default () => {
  const history = useHistory();

  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [checked, setChecked] = useState(true);

  const [outlays, setOutlays] = useState([]);
  const [valorTotal, setValorTotal] = useState();

  useEffect(() => {
    let date_outlay = "";

    if (checked) {
      date_outlay = date_outlay + ano;
      date_outlay =
        mes === "" ? date_outlay : [date_outlay, mes, dia].join("-");
    }

    const query = {
      date_outlay,
    };

    api
      .get("/outlay", { params: query })
      .then((response) => {
        setOutlays(response.data.outlays);
      })
      .catch((error) => {
        toast.error("Erro no acesso da API");
        console.error(error);
      });
  }, [ano, checked, dia, mes]);

  useEffect(() => {
    if (outlays.heigth === 0) return;
    setValorTotal(outlays.reduce((acc, item) => acc + item.amount, 0.0));
  }, [outlays]);

  
  return (
    <Print>
      <div className="mb-5 noprint">
        <div className="btn-group mb-2" role="group">
          <Button variant="secondary" onClick={() => history.goBack()}>
            Voltar
          </Button>
          <ButtonHandlePrint />
        </div>
        <div>
          <Form className="mt-2">
            <div className="row d-flex justify-content-start align-items-center">
              {checked || (
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
                      <OptionMeses />
                    </SelectFormControl>
                  </div>

                  {mes !== "" || (
                    <div className="col-2">
                      <SelectFormControl
                        label="Dia"
                        id="selectDia"
                        name="selectDia"
                        value={dia}
                        onChange={(event) => setDia(event.target.value)}
                      >
                        <OptionDias />
                      </SelectFormControl>
                    </div>
                  )}
                </>
              ) }
              <div className="col-2">
                <ButtonGroup toggle>
                  <ToggleButton
                    type="checkbox"
                    variant="secondary"
                    checked={checked}
                    value="1"
                    onChange={(e) => setChecked(e.currentTarget.checked)}
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
          <Cabecalho />

          <div className=" mb-auto">
            <p className="h2 text-center m-4  ">
              Relatorio de Gastos
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
              <BootstrapDataTable
                data={outlays}
                pagination={false}
                search={false}
                exportCSV={false}
                keyField="id"
              >
                <TableHeaderColumn dataField="id" dataSort width="5%">
                  #
                </TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataSort>
                  Descrição
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="amount"
                  dataSort
                  width="15%"
                  dataFormat={priceFormatter}
                >
                  Valor
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="date_outlay"
                  dataSort
                  width="15%"
                  dataFormat={dateFormatter}
                >
                  Data
                </TableHeaderColumn>
              </BootstrapDataTable>
            </div>
          </div>
        </div>

        <ButtonHandlePrint />
      </div>
    </Print>
  );
};
