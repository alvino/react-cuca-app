import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../server/api";
import { Button } from "react-bootstrap";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [orcamento, setOrcamento] = useState({});
  const [cliente, setCliente] = useState({});
  const [listaPedido, setListaPedido] = useState([]);

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
        toast.info(response.data.message);

        setListaPedido(response.data.wish_list);
        setOrcamento(response.data.budget);
        setCliente(response.data.client);
      })
      .catch((error) => {
        toast.error("Erro ao acessar API");
        console.error(error);
      });
  }, [history, id]);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.delete(`/budget/${id}`);
    toast.success(response.data.message);

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
        {" "}
        Confirmar remoção{" "}
      </Button>
    </div>
  );
};
