import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
// eslint-disable-next-line
import { toast } from "react-toastify";
import { Button, Form } from 'react-bootstrap'

import InputFormControl from '../../components/bootstrap/InputFormControl'
import InputNumberFormat from '../../components/bootstrap/InputNumberFormat'
import SelectFormControl from '../../components/bootstrap/SelectFormControl'


import api from '../../server/api'
import localizacao from '../../server/localizacao'

export default () => {
	const history = useHistory()
	const { id } = useParams(0)

	const [ufs, setUfs] = useState([]);
	const [cities, setCities] = useState([]);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		telephone: '',
		cpf: '',
	});

	const [selectedUf, setSelectedUf] = useState('');
	const [selectedCity, setSelectedCity] = useState('');

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
			const response = await localizacao.get("/estados.json");
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

		if (formData.name === '') {
			toast.warning('Preencha no minimo o nome')
			return
		}

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
		history.goBack()
	}

	return (
		<>
			<Button variant='secondary' size='lg' className='mb-4' onClick={() => history.goBack()}>Voltar</Button>

			<Form>

				<InputFormControl
					label='Nome'
					id="name"
					name="name"
					placeholder="Nome do Cliente"
					value={formData.name}
					onChange={handleChange}
				/>

				<InputFormControl
					label='Email'
					type="email"
					id="email"
					name="email"
					placeholder="Email do Cliente"
					value={formData.email}
					onChange={handleChange}
				/>

				<InputNumberFormat
					label='Telefone'
					type="tel"
					id="telephone"
					name="telephone"
					format='(##) # ####-####'
					prefix=''
					value={formData.telephone}
					onValueChange={(values) => setFormData({ ...formData, telephone: values.formattedValue })}
				/>

				<InputFormControl
					label='CPF/CNPJ'
					id="cpf"
					name="cpf"
					placeholder="CPF/CNPJ do Cliente"
					value={formData.cpf}
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

				<Button variant="primary" size='lg' onClick={handleSubmit}> Salvar Cadastro </Button>
			</Form>
		</>
	);
}

