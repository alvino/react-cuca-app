import React, { useState, useEffect, useCallback, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import localizacao from "../../services/localizacao";
import {} from "react";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedUf, setSelectedUf] = useState("");

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const telephoneInputRef = useRef();
  const cpfInputRef = useRef();
  const citySelectRef = useRef();
  const ufSelectRef = useRef();



  useEffect(() => {

    nameInputRef.current.focus()

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

        nameInputRef.current.value = client.name;
        emailInputRef.current.value = client.email;
        telephoneInputRef.current.value = client.telephone;
        cpfInputRef.current.value = client.cpf;
        citySelectRef.current.value = client.city;
        ufSelectRef.current.value = client.uf;
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

      const client = {
        uf: String(ufSelectRef.current.value).includes("Sele")
          ? ""
          : ufSelectRef.current.value,
        city: String(citySelectRef.current.value).includes("Sele")
          ? ""
          : citySelectRef.current.value,
        name: nameInputRef.current.value,
        email: emailInputRef.current.value,
        telephone: telephoneInputRef.current.value,
        cpf: cpfInputRef.current.value,
      };

      console.log(client)

      if (client.name === "") {
        toast.warning("Preencha no minimo o nome");
        return;
      }

      let response = {};
      if (id) {
        response = await api.put(`/client/${id}`, client);
      } else {
        response = await api.post("/client", client);
      }

      if (response.data) toast.success(response.data.message);
      history.goBack();
    },
    [history, id]
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nameInput">Name</label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            ref={nameInputRef}
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
          <label htmlFor="cpfInput">CPF/CNPJ</label>
          <input
            type="text"
            className="form-control"
            id="cpfInput"
            ref={cpfInputRef}
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
        <button type="submit" className="btn btn-primary">
          Salvar Cadastro
        </button>
      </form>
    </>
  );
};
