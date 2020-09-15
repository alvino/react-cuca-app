import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import api from "../../server/api";
import { Button, ToggleButton, ButtonGroup } from "react-bootstrap";
import BootstrapDataTable from "../../components/patterns/DataTable";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

import {
  OptionMeses,
  OptionDias,
} from "../../components/SelectFormControl";
import NumberFormat from "../../components/NumberFormat";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import { ButtonHandlePrint } from "../../components/Buttons";
import BannerSimples from "../../components/print/BannerSimples";

import Print from "../../styles/Print";

export default () => {
  const history = useHistory();

  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [checked, setChecked] = useState(true);

  const [sales, setSales] = useState([]);
  const [listaSale, setListSale] = useState([]);
  const [valorTotal, setValorTotal] = useState();

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.get("/sale");
        setSales(response.data.sales);
      } catch (error) {
        toast.error("Erro de rede ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    let filterDate = "";

    if (checked) {
      filterDate = filterDate + ano;
      filterDate = mes === "" ? filterDate : [filterDate, mes, dia].join("-");
    }

    const isFilterDate = (item) => {
      console.log(item, filterDate)
      return item.date_sale.includes(filterDate);
    }

    const filteredSales = sales.filter(isFilterDate);
    setListSale(filteredSales);
  }, [ano, checked, dia, mes, sales]);

  useEffect(() => {
    setValorTotal(listaSale.reduce((acc, item) => acc + item.amount, 0.0));
  }, [listaSale]);

  const handleButtonFiltrar = useCallback(
    (e) => {
      setChecked(e.currentTarget.checked);

      if (checked) {
        setMes("");
        setDia("");
      }
    },
    [checked]
  );

  return (
    <Print>
      <div className="my-2 noprint">
        <div>
          <div className="row d-flex justify-content-start align-items-center">
            {checked && (
              <>
                <div className="col-2">
                  <div className="form-group">
                    <label htmlFor="inputAno">Ano</label>
                    <input
                      className="form-control"
                      type="Number"
                      id="inputAno"
                      value={ano}
                      onChange={(event) => setAno(event.target.value)}
                    />
                  </div>
                </div>

                <div className="col-2">
                  <div className="form-group">
                    <label htmlFor="selectMes">Mês</label>
                    <select
                      id="selectMes"
                      className="form-control"
                      value={mes}
                      onChange={(event) => setMes(event.target.value)}
                    >
                      <OptionMeses />
                    </select>
                  </div>
                </div>

                {mes !== "" && (
                  <div className="col-2">
                    <div className="form-group">
                      <label htmlFor="selectDia">Dia</label>
                      <select
                        className="form-control"
                        id="selectDia"
                        value={dia}
                        onChange={(event) => setDia(event.target.value)}
                      >
                        <OptionDias />
                      </select>
                    </div>
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
                  onChange={handleButtonFiltrar}
                >
                  {checked ? "Todos" : "Filtrar"}
                </ToggleButton>
              </ButtonGroup>
            </div>
          </div>
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
                data={listaSale}
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
