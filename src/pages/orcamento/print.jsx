import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../server/api";
import { Button } from "react-bootstrap";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../components/bootstrap/DataTable";
import NumberFormat from "../../components/NumberFormat";
import DateFormat from "../../components/DateFormat";
import {
  numberFormatter,
  priceFormatter,
} from "../../utils/react-bootstrap-table-formatted";

import logoCuca from "../../assert/logo_cuca.svg";
import qrcodeWhats from "../../assert/whatsapp.png";
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
        keyField="index"
      >
        <TableHeaderColumn dataField="index" dataSort width="5%">
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

  const handleImprimir = () => window.print();

  return (
    <Print>
      <div className="btn-group mb-5 noprint" role="group">
        <Button variant="secondary" onClick={() => history.goBack()}>
          Voltar
        </Button>
        <Button onClick={handleImprimir}>Imprimir</Button>
      </div>

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
          <div className="text-center ml-2">
            <span className="h5 font-italic">Para Crescer,</span>
            <span className="h5 font-weight-bold"> Use a Cuca.</span>
          </div>
          <div className="d-flex justify-content-center">
            <img src={qrcodeWhats} height="90px" alt="whatsapp" />
          </div>
          <div>
            <div className="text-monospace">
              <FaPhone className="mx-2" />
              62
              <span className="  mx-2">3383-3046</span>
            </div>
            <div className="text-monospace">
              <FaWhatsapp className="mx-2" />
              62
              <span className="  mx-2">98314-8780</span>
            </div>
            <div className="text-monospace">
              <FaWhatsapp className="mx-2" />
              62
              <span className="  mx-2">98204-0184</span>
            </div>
            <div>
              <FaEnvelope className="mx-2" />
              <span>cuca_altohorizonte@gmail.com</span>
            </div>
            <div>
              <FaFacebook className="mx-2" />
              <span>cuca_altohorizonte</span>
            </div>
            <div>
              <FaInstagram className="mx-2" />
              <span>@cuca_altohorizonte</span>
            </div>
            <div>
              <FaMapMarkedAlt className="mx-2" />
              <span> Av. Getulio Vargas, 82 - Centro</span>
            </div>
          </div>
        </div>

        <div className=" mb-auto">
          <p className="h1 text-center m-4  ">Orçamento</p>

          <p className="h4 my-2">
            Codigo: <NumberFormat format="###########" value={Number(id)} />
          </p>

          <p className="text-right">Alto Horizonte-GO, {dataOrcamento}</p>
          <p className="text-right text-muted">
            Valido por 30 dias (ou ate dura o estoque)
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

      <Button className="mt-5 noprint" onClick={handleImprimir}>
        Imprimir
      </Button>
    </Print>
  );
};
