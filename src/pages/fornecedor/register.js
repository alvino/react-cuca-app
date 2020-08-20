import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
// eslint-disable-next-line
import { toast } from "react-toastify";
import { Button } from 'react-bootstrap'


import InputFormControl from '../../components/bootstrap/InputFormControl'
import SelectFormControl from '../../components/bootstrap/SelectFormControl'


import api from '../../server/api'
import localizacao from '../../server/localizacao'

export default () => {
  const history = useHistory()
  const { id } = useParams()

  const [ufs, setUfs] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    telephone: '',
    cnpj: '',
    bank_data: ''
  });

  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const actionChangeElementsValues = {
    selectedUf: (value) => setSelectedUf(value),
    selectedCity: (value) => setSelectedCity(value),
    nickname: (value) => setFormData({ ...formData, nickname: value }),
    email: (value) => setFormData({ ...formData, email: value }),
    telephone: (value) => setFormData({ ...formData, telephone: value }),
    cnpj: (value) => setFormData({ ...formData, cnpj: value }),
    bank_data: (value) => setFormData({ ...formData, bank_data: value }),
  };

  useEffect(() => {
    if (!id) return

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
        bank_data: provider.bank_data,
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
      const response = await localizacao.get("/estados.json");
      console.log(response)
      const ufInitials = response.data.estados.map((uf) => {
        return {
          sigla: uf.id,
          nome: uf.estado,
        };
      });

      setUfs(ufInitials)
    }

    apiUfs()
  }, [])

  // Load Cities
  useEffect(() => {
    if (selectedUf === '') return;

    async function apiCities() {
      const response = await localizacao.get(`/cidades/${selectedUf}.json`);
      console.log(response.data)
      const cityNames = response.data.cidades.map((city) => city.cidade);

      setCities(cityNames);
    }

    apiCities();
  }, [selectedUf]);

  function handleChange(event) {
    actionChangeElementsValues[event.target.name](event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.nickname === '') {
      toast.warning('Preencha no minimo a razão social')
      return
    }

    const provider = {
      uf: selectedUf,
      city: selectedCity,
      nickname: formData.nickname,
      email: formData.email,
      telephone: formData.telephone,
      cnpj: formData.cnpj,
      bank_data: formData.bank_data,
    }

    let response = {}
    if (id) {
      response = await api.put(`/provider/${id}`, provider)
    } else {
      response = await api.post('/provider', provider)
    }

    toast.success(response.data.message);
    history.goBack()
  }

  return (
    <>
      <Button variant='secondary' size='lg' className='mb-4' onClick={() => history.goBack()}>Voltar</Button>
      <form>

        <InputFormControl
          label='Razão'
          id='nickname'
          name='nickname'
          placeholder='Razão social'
          value={formData.nickname}
          onChange={handleChange}
        />

        <InputFormControl
          label='Email'
          type="email"
          id="email"
          name="email"
          placeholder="Email do Fornecedor"
          value={formData.email}
          onChange={handleChange}
        />

        <InputFormControl
          label='Telefone'
          type="tel"
          id="telephone"
          name="telephone"
          placeholder="Telefone do Fornecedor"
          value={formData.telephone}
          onChange={handleChange}
        />

        <InputFormControl
          label='CNPJ'
          id="cnpj"
          name="cnpj"
          placeholder="CNPJ do Fornecedor"
          value={formData.cnpj}
          onChange={handleChange}
        />

        <SelectFormControl
          label='Estado'
          name="selectedUf"
          id="selectedUf"
          value={selectedUf}
          onChange={handleChange}
        >
          <option>{ufs.length === 0 ? '...Loanding' : 'Selecionar Estado'}</option>
          {ufs.map((uf, id) => (
            <option key={id} value={uf.sigla}>
              {uf.nome}
            </option>
          ))}
        </SelectFormControl>

        <SelectFormControl
          label='Cidade'
          name="selectedCity"
          id="selectedCity"
          value={selectedCity}
          onChange={handleChange}
        >
          <option>{selectedUf === '0' ? 'Selecione um estado primeiro' : 'Selecionar Cidade'}</option>
          {cities.map((city, id) => (
            <option key={id}>{city}</option>
          ))}
        </SelectFormControl>

        <div class="form-group">
          <label for="textareaBankData">Dados Bancarios</label>
          <textarea
            class="form-control form-control-lg"
            id="textareaBankData"
            name='bank_data'
            rows="3"
            value={formData.bank_data}
            onChange={handleChange}
          />
        </div>

        <Button variant="primary" size='lg' onClick={handleSubmit}> Salvar Cadastro </Button>

      </form>
    </>
  );
}

