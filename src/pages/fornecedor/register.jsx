import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../server/api";
import localizacao from "../../server/localizacao";

export default () => {
  const history = useHistory();
  const { id } = useParams();

  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedUf, setSelectedUf] = useState("");

  const nicknameInputRef = useRef();
  const emailInputRef = useRef();
  const telephoneInputRef = useRef();
  const cnpjInputRef = useRef();
  const bankdataInputRef = useRef();
  const citySelectRef = useRef();
  const ufSelectRef = useRef();

  useEffect(() => {

    nicknameInputRef.current.focus()

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

        nicknameInputRef.current.value = provider.nickname;
        emailInputRef.current.value = provider.email;
        telephoneInputRef.current.value = provider.telephone;
        cnpjInputRef.current.value = provider.cnpj;
        bankdataInputRef.current.value = provider.bank_data;
        ufSelectRef.current.value = provider.uf;
        citySelectRef.current.value = provider.city;
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

    const provider = {
      uf: ufSelectRef.current.value,
      city: citySelectRef.current.value,
      nickname: nicknameInputRef.current.value,
      email: emailInputRef.current.value,
      telephone: telephoneInputRef.current.value,
      cnpj: cnpjInputRef.current.value,
      bank_data: bankdataInputRef.current.value,
    };

    if (provider.nickname === "") {
      toast.warning("Preencha no minimo a razão social");
      return;
    }

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
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nicknameInput">Razão</label>
          <input
            type="text"
            className="form-control"
            id="nicknameInput"
            ref={nicknameInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailInput">Email</label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            ref={emailInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telephoneInput">Telefone</label>
          <input
            type="tel"
            className="form-control"
            id="telephoneInput"
            ref={telephoneInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cnpjInput">CNPJ/CPF</label>
          <input
            type="text"
            className="form-control"
            id="cnpjInput"
            ref={cnpjInputRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ufSelect">Estado</label>
          <select
            id="ufSelect"
            className="form-control"
            ref={ufSelectRef}
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
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="citySelect">Cidade</label>
          <select id="citySelect" className="form-control" ref={citySelectRef}>
            <option>
              {selectedUf === "0"
                ? "Selecione um estado primeiro"
                : "Selecionar Cidade"}
            </option>
            {cities.map((city, id) => (
              <option key={id}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="textareaBankData">Dados Bancarios</label>
          <textarea
            className="form-control"
            id="textareaBankData"
            name="bank_data"
            rows="3"
            ref={bankdataInputRef}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Salvar Cadastro
        </button>
      </form>
    </>
  );
};
