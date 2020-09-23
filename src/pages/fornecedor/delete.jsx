import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Button } from "react-bootstrap";
import { useCallback } from "react";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    telephone: "",
    cnpj: "",
    bank_data: "",
  });

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  const apiShow = useCallback( () => {
    api.get(`/provider/${id}`)
    .then( response => {
      const [provider] = response.data.provider;
      if (!provider) {
        toast.error("fornecedor não encontrado");
        history.push("/fornecedor/register");
        return;
      }
      setFormData({
        nickname: provider.nickname,
        email: provider.email,
        telephone: provider.telephone,
        cnpj: provider.cnpj,
        bank_data: provider.bank_data,
      });
      setSelectedUf(provider.uf);
      setSelectedCity(provider.city);
    })
    .catch( error => {
      toast.error('Error ao acessar API')
      console.error(error)
    })
  }, [history, id]);

  useEffect(() => {
    if (!id) {
      history.push("/provider");
      return;
    }
    apiShow();
  }, [apiShow, history, id]);

  const handleSubmit = useCallback( async (event) => {
    event.preventDefault();
    const response = await api.delete(`/provider/${id}`);
    toast.success(response.data.message);
    history.push("/fornecedor");
  }, [history, id])

  
  return (
    <div>
      <h2>Tem certeza que deseja deletar:</h2>
      <div className="mt-4 mb-4 justify-content-center">
        <p>Razão: {formData.nickname}</p>

        <p>Email: {formData.email}</p>

        <p>Telefone: {formData.telephone}</p>

        <p>CNPJ: {formData.cnpj}</p>

        <p>Estado: {selectedUf}</p>

        <p>Cidade: {selectedCity}</p>

        <p>Dados Bancarios: {formData.bank_data}</p>
      </div>
      <Button variant="danger" onClick={handleSubmit}>
        Confirmar remoção
      </Button>
    </div>
  );
};
