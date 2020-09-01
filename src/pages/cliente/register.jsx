import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";

import InputFormControl from "../../components/bootstrap/InputFormControl";
import InputNumberFormat from "../../components/bootstrap/InputNumberFormat";
import SelectFormControl from "../../components/bootstrap/SelectFormControl";

import api from "../../server/api";
import localizacao from "../../server/localizacao";
import { useCallback } from "react";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    cpf: "",
  });

  const [selectedUf, setSelectedUf] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (!id) return;

    api
      .get(`/client/${id}`)
      .then((response) => {
        const [client] = response.data.client;
        if (!client) {
          toast.error("Cliente não encontrado");
          history.push("/cliente/register");
          return;
        }
        toast.info(response.data.message);
        setFormData({
          name: client.name,
          email: client.email,
          telephone: client.telephone,
          cpf: client.cpf,
        });
        setSelectedUf(client.uf);
        setSelectedCity(client.city);
      })
      .catch((error) => {
        toast.error("Erro de rede ao acessar API");
        console.error(error);
      });
  }, [history, id]);

  // Load UFs
  useEffect(() => {
    localizacao
      .get("/estados.json")
      .then((response) => {
        const ufInitials = response.data.estados.map((uf) => {
          return {
            sigla: uf.id,
            nome: uf.estado,
          };
        });
        setUfs(ufInitials);
      })
      .catch((error) => {
        toast.error("Erro de rede ao acessar as UF");
        console.error(error);
      });
  }, []);

  // Load Cities
  useEffect(() => {
    if (selectedUf === "") return;
    localizacao
      .get(`/cidades/${selectedUf}.json`)
      .then((response) => {
        const cityNames = response.data.cidades.map((city) => city.cidade);
        setCities(cityNames);
      })
      .catch((error) => {
        toast.error("Erro de rede ao acessar Cidades");
        console.error(error);
      });
  }, [selectedUf]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (formData.name === "") {
        toast.warning("Preencha no minimo o nome");
        return;
      }

      const client = {
        uf: selectedUf,
        city: selectedCity,
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        cpf: formData.cpf,
      };

      let response = {};
      if (id) {
        response = await api.put(`/client/${id}`, client);
      } else {
        response = await api.post("/client", client);
      }

      if (response.data) toast.success(response.data.message);
      history.goBack();
    },
    [
      formData.cpf,
      formData.email,
      formData.name,
      formData.telephone,
      history,
      id,
      selectedCity,
      selectedUf,
    ]
  );

  return (
    <>
      <Button
        variant="secondary"
        
        className="mb-4"
        onClick={() => history.goBack()}
      >
        Voltar
      </Button>

      <Form>
        <InputFormControl
          label="Nome"
          id="name"
          name="name"
          placeholder="Nome do Cliente"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <InputFormControl
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="Email do Cliente"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <InputNumberFormat
          label="Telefone"
          type="tel"
          id="telephone"
          name="telephone"
          format="(##) # ####-####"
          prefix=""
          value={formData.telephone}
          onValueChange={(values) =>
            setFormData({ ...formData, telephone: values.formattedValue })
          }
        />

        <InputFormControl
          label="CPF/CNPJ"
          id="cpf"
          name="cpf"
          placeholder="CPF/CNPJ do Cliente"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
        />

        <SelectFormControl
          label="Estado"
          name="selectedUf"
          id="selectedUf"
          value={selectedUf}
          onChange={(e) => setSelectedUf(e.target.value)}
        >
          <option>
            {ufs.length === 0 ? "...Loanding" : "Selecionar Estado"}
          </option>
          {ufs.map((uf, id) => (
            <option key={id} value={uf.sigla}>
              {uf.nome}
            </option>
          ))}
        </SelectFormControl>

        <SelectFormControl
          label="Cidade"
          name="selectedCity"
          id="selectedCity"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option>
            {selectedUf === "0"
              ? "Selecione um estado primeiro"
              : "Selecionar Cidade"}
          </option>
          {cities.map((city, id) => (
            <option key={id}>{city}</option>
          ))}
        </SelectFormControl>

        <Button variant="primary" onClick={handleSubmit}>
          
          Salvar Cadastro
        </Button>
      </Form>
    </>
  );
};
