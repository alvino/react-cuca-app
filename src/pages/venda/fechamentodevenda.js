import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify";
import { Button } from 'react-bootstrap'


import api from '../../server/api'
import InputFormControl from '../../components/bootstrap/InputFormControl'
import InputNumberFormat from '../../components/bootstrap/InputNumberFormat'
import NumberFormat from '../../components/NumberFormat'
import DateFormat from '../../components/DateFormat'
import SelectFormControl from '../../components/bootstrap/SelectFormControl'
import NavBarVenda from '../../components/NavBarVenda'



export default () => {
  const history = useHistory()
  const { id } = useParams(0)


  const [orcamento, setOrcamento] = useState({})
  const [cliente, setCliente] = useState({})
  const [listaPedido, setListaPedido] = useState([])


  const [desconto, setDesconto] = useState({ value: 0, floatValue: 0 })
  const [entrada, setEntrada] = useState({ value: 0, floatValue: 0 })
  const [selectedPagamento, setSelectedPagamento] = useState('A vista')
  const [parcelas, setParcelas] = useState(30)
  const [valorTotal, setValorTotal] = useState(0.0)


  useEffect(() => {
    async function fetchData() {
      const response = await api.get(`/budget/${id}`)
      setListaPedido(response.data.wish_list)
      setOrcamento(response.data.budget)
      setCliente(response.data.client)
    }
    fetchData()
  }, [id]);

  useEffect(() => {
    if (selectedPagamento === 'A vista') {
      setParcelas(30)
    }
    const dividendo = parcelas / 30
    const montante = orcamento.amount - (desconto.floatValue + entrada.floatValue)
    setValorTotal(parseFloat((montante / dividendo).toFixed(2)))
  }, [id, desconto, entrada, parcelas, selectedPagamento, orcamento]);

  const handlerOnValueChangeDesconto = (values) => {

    if (values.formattedValue === '') values = { value: 0, floatValue: 0 }

    setDesconto(values)
  }

  const handlerPushImprimir = () => {
    history.push(`/orcamento/print/${id}`)
  }

  const handleConfirmarConclusaoVenda = async () => {

    let sales = []

    
    const dividido = (parcelas / 30)
    
    if (selectedPagamento === 'A vista' || entrada.floatValue) {
      
      const date_sale = new Date().toISOString().substring(0, 10)
      const description = entrada.floatValue ? `${cliente.name} - entrada` : cliente.name
      const valor_venda = entrada.floatValue ? entrada.floatValue : parseFloat(valorTotal)
      
      sales.push({
        budget_id: id,
        description,
        amount: valor_venda,
        all_parcel: 0,
        parcel: 0,
        date_sale
      })
    }

    if (selectedPagamento === 'A prazo') {
      const timeHoje = new Date().getTime()
      const time30dias = 2592000000

      for (let index = 1; index <= dividido; index++) {

        const outraData = new Date(timeHoje + (time30dias * index))
        const date_sale = outraData.toISOString().substring(0, 10)
        const valor_venda = parseFloat(valorTotal)

        sales.push({
          budget_id: id,
          description: cliente.name,
          amount: valor_venda,
          all_parcel: dividido,
          parcel: index,
          date_sale
        })

      }
    }

    const resposta = await api.post('/sale', sales)

    if (resposta.status === 200) {
      toast.success(resposta.data.message)
      history.goBack()
    } else {
      toast.error(resposta.data.message)
    }

  }


  return (
    <div className='container-fluid'>
      <NavBarVenda
        title="Finalizar Venda"
        quantidadeDeItens={listaPedido.length}
        valorTotal={
          selectedPagamento === 'A vista' ?
            <NumberFormat value={valorTotal} />
            :
            <div>
              <span>{parcelas} X </span> < NumberFormat value={valorTotal} />
            </div>
        }
      />

      <div className="row">
        <div className="col-6">
          <div className="col-6 mt-5">
            <InputNumberFormat
              label='Desconto'
              className="form-control form-control-lg"
              id='inputDesconto'
              name='inputDesconto'
              value={desconto.formattedValue}
              onValueChange={handlerOnValueChangeDesconto}
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
                <>
                  <InputFormControl
                    label='Parcelas'
                    type='Number'
                    id='inputParcelas'
                    name='inputParcelas'
                    min='30'
                    max='120'
                    step='30'
                    value={parcelas}
                    onChange={(event) => setParcelas(event.target.value)}
                  />
                  <InputNumberFormat
                    label='Entrada'
                    id='inputEntrada'
                    name='inputEntrada'
                    value={entrada.formattedValue}
                    onValueChange={(values) => setEntrada(values)}
                  />
                </>
                : ''
            }


            <Button
              variant='primary'
              size='lg'
              onClick={handleConfirmarConclusaoVenda}
            > Confirmar Conclusão da Venda </Button>
          </div>
        </div >
        <div className="col-6">


          <Button
            variant='success'
            className='m-2'
            size='lg'
            onClick={handlerPushImprimir}
          > Imprimir Orcamento </Button>

          <p className='text-right'><DateFormat value={orcamento.created_at} /></p>

          <p className='font-weight-bold text-uppercase mb-2'>Cliente: {cliente.name}</p>
          <p className='text-right'>Valor Total: <NumberFormat value={(orcamento.amount - desconto.floatValue)} /></p>
          <p className='text-right'>Desconto: <NumberFormat value={desconto.floatValue || 0} /></p>
          {
            selectedPagamento === 'A prazo' ?
              <p className='text-right'>Entrada: <NumberFormat value={entrada.floatValue || 0} /></p>
              : ''
          }
          <div className='mt-3'>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '5%' }}>#</th>
                  <th scope="col">Descrição</th>
                  <th scope="col">Detalhes</th>
                  <th scope="col" style={{ width: '5%' }}>Quant.</th>
                  <th scope="col" style={{ width: '15%', textAlign: 'right' }}>Valor Unit.</th>
                  <th scope="col" style={{ width: '15%', textAlign: 'right' }}>Valor Total.</th>
                </tr>
              </thead>
              <tbody>

                {
                  listaPedido.map((produto, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{produto.description}</td>
                      <td>{produto.detail}</td>
                      <td><NumberFormat prefix='' value={produto.quantity} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <NumberFormat value={produto.sale_value} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <NumberFormat value={produto.amount} />
                      </td>
                    </tr>
                  ))
                }

              </tbody>
            </table>
          </div>


        </div>
      </div>
    </div>
  )
}
