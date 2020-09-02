import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../server/api";
import { Button, Form, ToggleButton, ButtonGroup } from "react-bootstrap";
import BootstrapDataTable from "../../components/bootstrap/DataTable";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

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
import {ButtonHandlePrint} from '../../components/bootstrap/Buttons'
import BannerSimples from "../../components/print/BannerSimples";

import Print from "../../styles/Print";

export default () => {
  const history = useHistory();

  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [checked, setChecked] = useState(true);

  const [sales, setSales] = useState([]);
  const [valorTotal, setValorTotal] = useState();

  useEffect(() => {
    let date_sale = "";

    if (checked) {
      date_sale = date_sale + ano;
      date_sale = mes === "" ? date_sale : [date_sale, mes, dia].join("-");
    }

    const query = {
      date_sale,
    };

    api
      .get("/sale", { params: query })
      .then((response) => {
        setSales(response.data.sales);
      })
      .catch((error) => {
        toast.error("Erro de rede ao acessar API");
        console.error(error);
      });
  }, [ano, mes, dia, checked]);

  useEffect(() => {
    if (sales.heigth === 0) return;
    setValorTotal(sales.reduce((acc, item) => acc + item.amount, 0.0));
  }, [sales]);


  return (
    <Print>
      <div className="my-2 noprint">
        <div>
          <Form >
            <div className="row d-flex justify-content-start align-items-center">
              {checked && (
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

                  {mes !== "" && (
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
              )}
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
          <div className="btn-group my-2" role="group">
            <Button variant="secondary" onClick={() => history.goBack()}>
              Voltar
            </Button>
            <ButtonHandlePrint />
          </div>
        </div>
      </div>
      <div>
        <div className="print">
          <BannerSimples />

          <div className=" mb-auto">
            <p className="h2 text-center m-4  ">
              Relatorio de Ganhos
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
                keyField="id"
                pagination={false}
                search={false}
                exportCSV={false}
                data={sales}
              >
                <TableHeaderColumn dataField="id" width="8%" dataSort>
                  #
                </TableHeaderColumn>
                <TableHeaderColumn dataField="description" dataSort>
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
                  dataSort
                  width="20%"
                  dataFormat={priceFormatter}
                >
                  Valor
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="date_sale"
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
