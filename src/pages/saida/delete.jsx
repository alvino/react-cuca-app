import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Button } from "react-bootstrap";

import NumberFormat from "../../components/NumberFormat";
import DateFormat from "../../components/DateFormat";
import { useCallback } from "react";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [gasto, setGasto] = useState({});

  useEffect(() => {
    api
      .get(`/outlay/${id}`)
      .then((response) => {
        if (response.status === 500) {
          toast.error("Venda não encontrado");
          history.push("/saida");
          return;
        }
        setGasto(response.data.outlay);
      })
      .catch((error) => {
        toast.error("Erro ao acessar API");
        console.error(error);
      });
  }, [history, id]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const response = await api.delete(`/outlay/${id}`);
      toast.success('gasto deletado com sucesso');
      history.push("/saida");
    },
    [history, id]
  );

  return (
    <div>
      <h2>Tem certeza que deseja deletar:</h2>
      <div className="mt-4 mb-4 justify-content-center">
        <p>Codigo: {gasto.id}</p>

        <p>Descrição: {gasto.description}</p>

        <p>
          Valor: <NumberFormat value={gasto.amount} />
        </p>

        <p>
          Vencimento: <DateFormat value={gasto.date_outlay} />
        </p>

        <p>
          Data de criação: <DateFormat value={gasto.created_at} />
        </p>
      </div>
      <Button variant="danger" onClick={handleSubmit}>
        Confirmar remoção
      </Button>
    </div>
  );
};
