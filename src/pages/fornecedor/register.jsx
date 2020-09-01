import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

import InputFormControl from "../../components/bootstrap/InputFormControl";
import SelectFormControl from "../../components/bootstrap/SelectFormControl";

import api from "../../server/api";
import localizacao from "../../server/localizacao";

export default () => {
  const history = useHistory();
  const { id } = useParams();

  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    telephone: "",
    cnpj: "",
    bank_data: "",
  });

  const [selectedUf, setSelectedUf] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/provider/${id}`)
      .then((response) => {
        const [provider] = response.data.provider;
        if (!provider) {
          toast.error("fornecedor não encontrado");
          history.push("/fornecedor/register");
          return;
        }
        toast.info(response.data.message);
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
      .catch((error) => {
        toast.error("Erro ao acessar API");
        console.error(error);
      });
  }, [history, id]);

  // Load UFs
  useEffect(() => {
    async function apiUfs() {
      const response = await localizacao.get("/estados.json");

      const ufInitials = response.data.estados.map((uf) => {
        return {
          sigla: uf.id,
          nome: uf.estado,
        };
      });

      setUfs(ufInitials);
    }

    apiUfs();
  }, []);

  // Load Cities
  useEffect(() => {
    if (selectedUf === "") return;

    async function apiCities() {
      const response = await localizacao.get(`/cidades/${selectedUf}.json`);

      const cityNames = response.data.cidades.map((city) => city.cidade);

      setCities(cityNames);
    }

    apiCities();
  }, [selectedUf]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.nickname === "") {
      toast.warning("Preencha no minimo a razão social");
      return;
    }

    const provider = {
      uf: selectedUf,
      city: selectedCity,
      nickname: formData.nickname,
      email: formData.email,
      telephone: formData.telephone,
      cnpj: formData.cnpj,
      bank_data: formData.bank_data,
    };

    let response = {};
    if (id) {
      response = await api.put(`/provider/${id}`, provider);
    } else {
      response = await api.post("/provider", provider);
    }

    toast.success(response.data.message);
    history.goBack();
  };

  return (
    <>
      <Button
        variant="secondary"
        className="mb-4"
        onClick={() => history.goBack()}
      >
        Voltar
      </Button>
      <form>
        <InputFormControl
          label="Razão"
          id="nickname"
          name="nickname"
          placeholder="Razão social"
          value={formData.nickname}
          onChange={(e) =>
            setFormData({ ...formData, nickname: e.target.value })
          }
        />

        <InputFormControl
          label="Email"
          type="email"
          id="email"
          name="email"
          placeholder="Email do Fornecedor"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <InputFormControl
          label="Telefone"
          type="tel"
          id="telephone"
          name="telephone"
          placeholder="Telefone do Fornecedor"
          value={formData.telephone}
          onChange={(e) =>
            setFormData({ ...formData, telephone: e.target.value })
          }
        />

        <InputFormControl
          label="CNPJ"
          id="cnpj"
          name="cnpj"
          placeholder="CNPJ do Fornecedor"
          value={formData.cnpj}
          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
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

        <div className="form-group">
          <label for="textareaBankData">Dados Bancarios</label>
          <textarea
            className='form-control'
            id="textareaBankData"
            name="bank_data"
            rows="3"
            value={formData.bank_data}
            onChange={(e) =>
              setFormData({ ...formData, bank_data: e.target.value })
            }
          />
        </div>

        <Button variant="primary" onClick={handleSubmit}>
          
          Salvar Cadastro
        </Button>
      </form>
    </>
  );
};
