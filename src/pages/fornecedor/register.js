import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify";
import api from '../../server/api'
import ibge from '../../server/ibge'

export default () => {
  const history = useHistory()
  const { id } = useParams()

  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    telephone: "",
    cnpj: "",
  });

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  const actionChangeElementsValues = {
    selectedUf: (value) => setSelectedUf(value),
    selectedCity: (value) => setSelectedCity(value),
    nickname: (value) => setFormData({ ...formData, nickname: value }),
    email: (value) => setFormData({ ...formData, email: value }),
    telephone: (value) => setFormData({ ...formData, telephone: value }),
    cnpj: (value) => setFormData({ ...formData, cnpj: value }),
  };

  useEffect(() => {
    if (!id) return

    toast.info('Carregando dados do fornecedor', { autoClose: 2000 })

    async function apiShow() {
      const response = await api.get(`/provider/${id}`)
      const [provider] = response.data.provider
      if (!provider) {
        toast.error('fornecedor não encontrado')
        history.push('/fornecedor/register')
        return
      }
      toast.info(response.data.message)
      setFormData({
        nickname: provider.nickname,
        email: provider.email,
        telephone: provider.telephone,
        cnpj: provider.cnpj,
      })
      setSelectedUf(provider.uf)
      setSelectedCity(provider.city)
    }

    apiShow()
    // eslint-disable-next-line
  }, [])

  // Load UFs
  useEffect(() => {
    async function apiUfs() {
      const response = await ibge.get("/estados?orderBy=nome");

      const ufInitials = response.data.map((uf) => {
        return {
          sigla: uf.sigla,
          nome: uf.nome,
        };
      });

      setUfs(ufInitials)
    }

    apiUfs()
  }, [])

  // Load Cities
  useEffect(() => {
    if (selectedUf === "0") return;

    async function apiCities() {
      const response = await ibge.get(
        `/estados/${selectedUf}/municipios`
      );

      const cityNames = response.data.map((city) => city.nome);

      setCities(cityNames);
    }

    apiCities();
  }, [selectedUf]);

  function handleChange(event) {
    actionChangeElementsValues[event.target.name](event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    let response = {}
    if (id) {
      response = await api.put(`/provider/${id}`, {
        uf: selectedUf,
        city: selectedCity,
        nickname: formData.nickname,
        email: formData.email,
        telephone: formData.telephone,
        cnpj: formData.cnpj
      })
    } else {
      response = await api.post('/provider', {
        uf: selectedUf,
        city: selectedCity,
        nickname: formData.nickname,
        email: formData.email,
        telephone: formData.telephone,
        cnpj: formData.cnpj
      })
    }

    toast.success(response.data.message);
    history.push("/provider");
  }

  return (
    <form className="p-5" onSubmit={handleSubmit} method="POST">
      <div className='form-group'>
        <legend>Cadastro de Fornecedor
        </legend>

        <label htmlFor="nickname">Razão</label>
        <input
          className="form-control"
          type="text"
          name="nickname"
          id="nickname"
          placeholder="Razão do Fornecedor"
          value={formData.nickname}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          className="form-control"
          type="email"
          name="email"
          id="email"
          placeholder="Email do Fornecedor
          "
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="phone">Telefone</label>
        <input
          className="form-control"
          type="tel"
          name="telephone"
          id="phone"
          placeholder="Telefone do Fornecedor
          "
          value={formData.telephone}
          onChange={handleChange}
        />

        <label htmlFor="cnpj">CNPJ</label>
        <input
          className="form-control"
          type="text"
          name="cnpj"
          id="cnpj"
          placeholder="CNPJ do Fornecedor
          "
          value={formData.cnpj}
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
          <option>Selecionar Cidade</option>
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

