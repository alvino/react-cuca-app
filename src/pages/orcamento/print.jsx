import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../components/patterns/DataTable";
import NumberFormat from "../../components/NumberFormat";
import DateFormat from "../../components/DateFormat";
import {
  numberFormatter,
  priceFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import BannerContato from "../../components/print/BannerContato"
import {ButtonHandlePrint} from "../../components/Buttons"

import Print from "../../styles/Print";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [orcamento, setOrcamento] = useState({});
  const [cliente, setCliente] = useState({});
  const [listaPedido, setListaPedido] = useState([]);
  const [dataOrcamento, setDataOrcamento] = useState("");

  useEffect(() => {
    if (!id) {
      history.push("/orcamento");
      return;
    }
    api
      .get(`/budget/${id}`)
      .then((response) => {
        const budget = response.data.budget;
        if (!budget) {
          toast.error("orcamento não encontrado");
          history.push("/orcamento");
          return;
        }

        const serializedWishList = response.data.wish_list.map(
          (item, index) => ({
            index: index + 1,
            ...item,
          })
        );

        setListaPedido(serializedWishList);
        setOrcamento(response.data.budget);
        setCliente(response.data.client);
      })
      .catch((error) => {
        toast.error("Erro ao acessar API");
        console.error(error);
      });
  }, [history, id]);

  useEffect(() => {
    setDataOrcamento(<DateFormat value={String(orcamento.created_at)} />);
  }, [orcamento]);

  const dataList = useMemo(() => {
    return (
      <BootstrapDataTable
        data={listaPedido}
        pagination={false}
        search={false}
        exportCSV={false}
      >
        <TableHeaderColumn dataField="index" isKey dataSort width="5%">
          #
        </TableHeaderColumn>
        <TableHeaderColumn dataField="description" dataSort>
          Descrição
        </TableHeaderColumn>
        <TableHeaderColumn dataField="detail">Detalhe</TableHeaderColumn>
        <TableHeaderColumn
          dataField="quantity"
          dataSort
          width="10%"
          dataFormat={numberFormatter}
        >
          Quant.
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="sale_value"
          width="15%"
          dataSort
          dataFormat={priceFormatter}
        >
          Valor Unit.
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="amount"
          dataSort
          width="15%"
          dataFormat={priceFormatter}
        >
          Valor Total
        </TableHeaderColumn>
      </BootstrapDataTable>
    );
  }, [listaPedido]);


  return (
    <Print>
      <div className="btn-group mb-5 noprint" role="group">
        <Button variant="secondary" onClick={() => history.goBack()}>
          Voltar
        </Button>
        <ButtonHandlePrint />
      </div>

      <div className="print">
        
        <BannerContato />

        <div className=" mb-auto">
          <p className="h1 text-center m-4  ">Orçamento</p>

          <p className="h4 my-2">
            Codigo: <NumberFormat format="###########" value={Number(id)} />
          </p>

          <p className="text-right">Alto Horizonte-GO, {dataOrcamento}</p>
          <p className="text-right text-muted">
            Valido por 15 dias
          </p>

          <p className="font-weight-bold text-uppercase mb-2">
            Cliente: {cliente.name}
          </p>

          <p className="mb-2">CPF/CNPJ: {cliente.cpf}</p>

          <div className="mt-3">
            <p className="text-right font-weight-bold">
              <span className="h4">
                
                <NumberFormat value={Number(orcamento.amount)} />
              </span>
            </p>

            {dataList}
          </div>
        </div>
      </div>

      <ButtonHandlePrint />
    </Print>
  );
};
