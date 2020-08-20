import React, { useState, useEffect } from "react";
import { useHistory, } from 'react-router-dom'
import { toast } from "react-toastify";
import { Button, Form } from 'react-bootstrap'

import InputFormControl from '../../components/bootstrap/InputFormControl'
import InputNumberFormat from '../../components/bootstrap/InputNumberFormat'
import NumberFormat from '../../components/NumberFormat'
import DateFormat from '../../components/DateFormat'
import SelectFormControl from '../../components/bootstrap/SelectFormControl'
import api from '../../server/api'

export default () => {
	const history = useHistory()

	const [data, setData] = useState()
	const [valor, setValor] = useState({ floatValue: 0 })
	const [descricao, setDescricao] = useState('');
	const [selectedPagamento, setSelectedPagamento] = useState('A vista')
	const [parcelas, setParcelas] = useState(2)

	const [sales, setSales] = useState([])

	useEffect(() => {

		let sales = []
		const valor_venda = valor.floatValue
		const data_venda = (data ? new Date(data.split('-').map(item => (parseInt(item)))) : new Date())

		console.log(data_venda)
		if (selectedPagamento === 'A vista') {

			const date_sale = data_venda.toISOString().substring(0, 10)

			sales.push({
				description: descricao,
				amount: valor_venda,
				all_parcel: 0,
				parcel: 0,
				date_sale
			})
		}
		if (selectedPagamento === 'A prazo') {

			const valor_parcelas = parseFloat((valor_venda / parcelas).toFixed(2))
			const timeHoje = data_venda.getTime()

			for (let index = 1; index <= parcelas; index++) {

				const outraData = new Date(timeHoje + (2592000000 * index))
				const date_sale = outraData.toISOString().substring(0, 10)

				sales.push({
					description: descricao,
					amount: valor_parcelas,
					all_parcel: parcelas,
					parcel: index,
					date_sale
				})

			}
		}

		setSales(sales)

	}, [data, valor, descricao, selectedPagamento, parcelas])

	async function handleSubmit(event) {
		event.preventDefault();

		const resposta = await api.post('/sale', sales)

		if (resposta.status === 200) {
			toast.success(resposta.data.message)
			history.goBack()
		} else {
			toast.error(resposta.data.message)
		}
	}

	return (
		<>
			<div class="row p-3"><Button variant='secondary' size='lg' className='mb-4' onClick={() => history.goBack()}>Voltar</Button></div>
			<div class="row">
				<div class="col-3">
					<Form>

						<InputFormControl
							label='Data'
							className='form-control form-control-lg'
							type='date'
							id='inputData'
							value={data}
							onChange={(event) => setData(event.target.value)}
						/>
						<InputFormControl
							label='Descrição'
							id="inputDescricao"
							name="inputDescricao"
							value={descricao}
							onChange={(event) => setDescricao(event.target.value)}
						/>

						<InputNumberFormat
							label='Valor'
							className="form-control form-control-lg"
							id='inputValor'
							name='inputValor'
							value={valor.formattedValue}
							onValueChange={(values) => setValor(values)}
						/>

						<SelectFormControl
							label='Pagamento'
							id="selectedPagamento"
							name="selectedPagamento"
							value={selectedPagamento}
							onChange={(event) => setSelectedPagamento(event.target.value)}
						>
							<option>A vista</option>
							<option>A prazo</option>
						</SelectFormControl>
						{
							selectedPagamento === 'A prazo' ?
								<InputFormControl
									label='Parcelas'
									type='Number'
									className="form-control form-control-lg"
									id='inputParcelas'
									name='inputParcelas'
									min='1'
									value={parcelas}
									onChange={(event) => setParcelas(event.target.value)}
								/>
								: ''
						}

						<Button variant="primary" size='lg' onClick={handleSubmit}> Salvar Cadastro </Button>
					</Form>

				</div>
				<div class="col-3"></div>
				<div class="col-6">
					<table className="table table-hover">
						<thead>
							<tr>

								<th scope="col">Descrição</th>
								<th scope="col" style={{ width: '5%' }}>De</th>
								<th scope="col" style={{ width: '5%' }}>Par.</th>
								<th scope="col" style={{ width: '15%' }} className='text-right'>Valor</th>
								<th scope="col" style={{ width: '15%' }} className='text-right'>Data</th>
							</tr>
						</thead>
						<tbody>
							{
								sales.map(
									(item, index) => (
										<tr key={index}>
											<td>{item.description}</td>
											<td>
												<NumberFormat value={item.parcell} prefix='' />
											</td>
											<td>
												<NumberFormat value={item.all_parcell} prefix='' />
											</td>
											<td className='text-right'>
												<NumberFormat value={item.amount} />
											</td>
											<td className='text-right'>
												<DateFormat value={item.date_sale} />
											</td>
										</tr>
									)
								)
							}
						</tbody>
					</table>
				</div>

			</div>
		</>
	);
}

