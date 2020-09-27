import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Button } from "react-bootstrap";

export default () => {
  const history = useHistory();
  const { id: orcamento_id } = useParams(0);

  const [orcamento, setOrcamento] = useState({});
  const [cliente, setCliente] = useState({});
  const [listaPedido, setListaPedido] = useState([]);

  useEffect(() => {
    if (!orcamento_id) {
      history.push("/orcamento");
      return;
    }

    async function fetch() {
      try {
        const response = await api.get(`/budget/${orcamento_id}`);

        const { budget } = response.data;
        if (!budget) {
          toast.error("orcamento não encontrado");
          history.push("/orcamento");
          return;
        }

        setOrcamento(budget);
      } catch (error) {
        toast.error("Erro ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, [history, orcamento_id]);

  useEffect(() => {
    if (!orcamento_id) {
      history.push("/orcamento");
      return;
    }

    async function fetch() {
      try {
        const response = await api.get(`/requested_budget/${orcamento_id}`);

        const { requested_budgets } = response.data;
        if (!requested_budgets) {
          toast.error("orcamento não encontrado");
          history.push("/orcamento");
          return;
        }

        setListaPedido(requested_budgets);
      } catch (error) {
        toast.error("Erro ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, [history, orcamento_id]);

  useEffect(() => {
    if (!orcamento.client_id) {
      return;
    }

    async function fetch() {
      try {
        const response = await api.get(`/client/${orcamento.client_id}`);

        const { client } = response.data;
        if (!client) {
          toast.error("orcamento não encontrado");
          history.push("/orcamento");
          return;
        }

        setCliente(client);
      } catch (error) {
        toast.error("Erro ao acessar API");
        console.error(error);
      }
    }

    fetch();
  }, [history, orcamento]);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.delete(`/budget/${orcamento_id}`);
    toast.success('orcamento deletado com sucesso');

    history.push("/orcamento");
  }

  return (
    <div>
      <h2>Tem certeza que deseja deletar:</h2>
      <div className="mt-4 mb-4">
        <p>Cliente: {cliente.name}</p>

        <p>Valor Total: {orcamento.amount}</p>

        <p>Produtos: </p>

        {listaPedido.map((produto) => (
          <div>
            <p>descricão: {produto.description}</p>
            <p>quantidade: {produto.quantity}</p>
            <p>valor: {produto.amount}</p>
          </div>
        ))}
      </div>
      <Button variant="danger" onClick={handleSubmit}>
        Confirmar remoção
      </Button>
    </div>
  );
};
