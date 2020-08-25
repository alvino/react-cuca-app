import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../server/api";
import { Button } from "react-bootstrap";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaMapMarkedAlt,
} from "react-icons/fa";

import NumberFormat from "../../../components/NumberFormat";
import DateFormat from "../../../components/DateFormat";
import logoCuca from "../../../assert/logo_cuca.svg";
import qrcodeWhats from "../../../assert/whatsapp.png";
import "./style.css";

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

    async function apiShow() {
      const response = await api.get(`/budget/${id}`);
      const budget = response.data.budget;
      if (!budget) {
        toast.error("orcamento não encontrado");
        history.push("/orcamento");
        return;
      }

      setListaPedido(response.data.wish_list);
      setOrcamento(response.data.budget);
      setCliente(response.data.client);
    }

    apiShow();
  }, [history, id]);

  useEffect(() => {
    setDataOrcamento(<DateFormat value={String(orcamento.created_at)} />);
  }, [orcamento]);

  const handleImprimir = () => window.print();

  return (
    <div>
      <div className="btn-group mb-5" role="group">
        <Button variant="secondary" size="lg" onClick={() => history.goBack()}>
          Voltar
        </Button>
        <Button size="lg" onClick={handleImprimir}>
          Imprimir
        </Button>
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

          {cliente.name ? (
            <p className="font-weight-bold text-uppercase mb-2">
              Cliente: {cliente.name}
            </p>
          ) : (
            ""
          )}
          {cliente.cpf ? <p className="mb-2">CPF/CNPJ: {cliente.cpf}</p> : ""}

          <div className="mt-3">
            <p className="text-right font-weight-bold">
              <span className="h4">
                {" "}
                <NumberFormat value={Number(orcamento.amount)} />{" "}
              </span>
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "5%" }}>
                    #
                  </th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Detalhes</th>
                  <th scope="col" style={{ width: "5%" }}>
                    Quant.
                  </th>
                  <th scope="col" style={{ width: "15%", textAlign: "right" }}>
                    Valor Unit.
                  </th>
                  <th scope="col" style={{ width: "15%", textAlign: "right" }}>
                    Valor Total.
                  </th>
                </tr>
              </thead>
              <tbody>
                {listaPedido.map((produto, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{produto.description}</td>
                    <td>{produto.detail}</td>
                    <td>
                      <NumberFormat value={produto.quantity} prefix="" />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <NumberFormat value={produto.sale_value} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <NumberFormat value={produto.amount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Button className="mt-5" size="lg" onClick={handleImprimir}>
        Imprimir
      </Button>
    </div>
  );
};
