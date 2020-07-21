import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify";
import api from '../../server/api'
import ibge from '../../server/ibge'

export default () => {
  const history = useHistory()
  const { id } = useParams(0)

  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    cpf: "",
  });

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  const actionChangeElementsValues = {
    selectedUf: (value) => setSelectedUf(value),
    selectedCity: (value) => setSelectedCity(value),
    name: (value) => setFormData({ ...formData, name: value }),
    email: (value) => setFormData({ ...formData, email: value }),
    telephone: (value) => setFormData({ ...formData, telephone: value }),
    cpf: (value) => setFormData({ ...formData, cpf: value }),
  };

  useEffect(() => {
    if (!id) return

    async function apiShow() {
      const response = await api.get(`/client/${id}`)
      const [client] = response.data.client
      if (!client) {
        toast.error('Cliente não encontrado')
        history.push('/cliente/register')
        return
      }
      toast.info(response.data.message)
      setFormData({
        name: client.name,
        email: client.email,
        telephone: client.telephone,
        cpf: client.cpf,
      })
      setSelectedUf(client.uf)
      setSelectedCity(client.city)
    }

    apiShow()
    // eslint-disable-next-line
  }, [])

  // Load UFs
  useEffect(() => {
    async function apiUfs() {
      const response = await ibge.get("/estados?orderBy=nome")

      const ufInitials = response.data.map((uf) => {
        return {
          sigla: uf.sigla,
          nome: uf.nome,
        };
      });

      setUfs(ufInitials);
    }

    apiUfs();
  }, []);

  // Load Cities
  useEffect(() => {
    if (selectedUf === "0") return;

    async function apiCities() {
      const response = await ibge.get(`/estados/${selectedUf}/municipios`)

      const cityNames = response.data.map((city) => city.nome);

      setCities(cityNames);
    }

    apiCities();
  }, [selectedUf]);

  function handleChange(event) {
    actionChangeElementsValues[event.target.name](event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const client = {
      uf: selectedUf,
      city: selectedCity,
      name: formData.name,
      email: formData.email,
      telephone: formData.telephone,
      cpf: formData.cpf
    }

    let response = {}
    if (id) {
      response = await api.put(`/client/${id}`, client)
    } else {
      response = await api.post('/client', client)
    }

    if (response.data) toast.success(response.data.message);
    history.push("/cliente");
  }

  return (
    <form className="p-5" onSubmit={handleSubmit} method="POST">
      <div className='form-group'>
        <legend>Cadastro de Cliente</legend>

        <label htmlFor="name">Nome</label>
        <input
          className="form-control"
          type="text"
          name="name"
          id="name"
          placeholder="Nome do Cliente"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          className="form-control"
          type="email"
          name="email"
          id="email"
          placeholder="Email do Cliente"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="phone">Telefone</label>
        <input
          className="form-control"
          type="tel"
          name="telephone"
          id="phone"
          placeholder="Telefone do Cliente"
          value={formData.telephone}
          onChange={handleChange}
        />

        <label htmlFor="cpf">CPF</label>
        <input
          className="form-control"
          type="text"
          name="cpf"
          id="cpf"
          placeholder="CPF do Cliente"
          value={formData.cpf}
          onChange={handleChange}
        />

        <label htmlFor="selectedUf">Estado</label>
        <select
          className="form-control"
          type="select"
          name="selectedUf"
          id="selectedUf"
          value={selectedUf}
          onChange={handleChange}
        >
          <option>Selecionar Estado</option>
          {ufs.map((uf, id) => (
            <option key={id} value={uf.sigla}>
              {uf.nome}
            </option>
          ))}
        </select>

        <label htmlFor="selectedCity">Cidade</label>
        <select
          className="form-control"
          type="select"
          name="selectedCity"
          id="selectedCity"
          value={selectedCity}
          onChange={handleChange}
        >
          <option >Selecionar Cidade</option>
          {cities.map((city, id) => (
            <option key={id}>{city}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Salvar Cadastro
      </button>
    </form>
  );
}

