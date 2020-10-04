import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import BootstrapDataTable from "../../components/patterns/DataTable";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

import { OptionMeses, OptionDias } from "../../components/SelectFormControl";
import NumberFormat from "../../components/NumberFormat";
import {
  priceFormatter,
  dateFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import { ButtonHandlePrint } from "../../components/Buttons";
import BannerSimples from "../../components/print/BannerSimples";
import Collapse from "../../components/Collapse";

import Print from "../../styles/Print";

export default () => {
  const history = useHistory();

  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState("");
  const [dia, setDia] = useState("");
  const [checked, setChecked] = useState(true);

  const [sales, setSales] = useState([]);
  const [listaSale, setListSale] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);

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
      return item.date_sale.includes(filterDate);
    };

    const filteredSales = sales.filter(isFilterDate);
    setListSale(filteredSales);
  }, [ano, checked, dia, mes, sales]);

  useEffect(() => {
    setValorTotal(listaSale.reduce((acc, item) => acc + item.amount, 0.0));
  }, [listaSale]);

  const handlerFiltrer = useCallback((isFilter) => {
    setChecked(!isFilter);
    if (!isFilter) {
      setMes("");
      setDia("");
    }
  }, []);

  return (
    <Print>
      <div className="my-2 noprint">
        <div>
          <Collapse isFilter={false} handlerFilter={handlerFiltrer}>
            <div>
              <div className="row">
                <div className="col-1">
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
                  <div className="col-1">
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
              </div>
            </div>
          </Collapse>
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
        <div className="mt-5">
          <ButtonHandlePrint />
        </div>
      </div>
    </Print>
  );
};
