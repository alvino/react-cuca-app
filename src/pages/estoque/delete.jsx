import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import { useCallback } from "react";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [stock, setStock] = useState({
    description: "",
    detail: "",
    unit: "",
    quantity: -1,
    quantity_of: -1,
    purchase_price: -1,
    sale_value: -1,
  });

  useEffect(() => {
    if (!id) {
      history.push("/estoque");
      return;
    }
    async function fetch() {
      try {
        const response = await api.get(`/stock/${id}`);
        const data = response.data.stock;
        if (!data) {
          toast.error("Produto nao encontrado");
          history.push("/estoque/register");
          return;
        }
        setStock({
          nickname: data.nickname,
          description: data.description,
          detail: data.detail,
          unit: data.unit,
          quantity: parseFloat(data.quantity),
          quantity_of: parseFloat(data.quantity_of),
          purchase_price: parseFloat(data.purchase_price),
          sale_value: parseFloat(data.sale_value),
        });
      } catch (err) {
        toast.error("Erro ao acessar API");
        console.error(err);
      }
    }

    fetch();
  }, [history, id]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const diferenca = stock.quantity - stock.quantity_of
      if(diferenca === 0) {
        toast.info("Não e possivel remover pois estes dodos são usados. Para relatorios")
        return
      }

      let response = null;
      if (stock.quantity_of > 0) {
        response = await api.put(`stock/${id}`, {
          quantity: stock.quantity_of
        });
      } else {
        response = await api.delete(`/stock/${id}`);
      }
      if (response.status >= 500) {
        toast.error("erro interno no servidor ao deletar produto");
        return;
      }
      toast.success("produto deletado");
      history.push("/estoque");
    },
    [history, id, stock]
  );

  return (
    <div>
      <h2>Tem certeza que deseja deletar:</h2>
      <div className="mt-4 mb-4 justify-content-center">
        <p>Fornecedor: {stock.nickname}</p>
        <p>Descrição: {stock.description}</p>
        <p>Detalhe: {stock.detail}</p>
        <p>Unidade: {stock.unit}</p>
        <p>Quantidade: {stock.quantity}</p>
        <p>Quantidade Vendida: {stock.quantity_of}</p>
        <p>Preço: {stock.purchase_price}</p>
        <p>Preço Venda: {stock.sale_value}</p>
      </div>
      <Button variant="danger" onClick={handleSubmit}>
        Confirmar remoção
      </Button>
    </div>
  );
};
