import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify";
import { Button } from 'react-bootstrap'
import { TableHeaderColumn } from 'react-bootstrap-table'
import {
  BsListUl as IconList,
  BsTrashFill as IconRemoveList
} from 'react-icons/bs'


import api from '../../server/api'
import ModalCenterBootstrapTable from '../../components/ModalCenterBootstrapTable'
import InputFormControl from '../../components/bootstrap/InputFormControl'
import InputNumberFormat from '../../components/bootstrap/InputNumberFormat'
import NumberFormat from '../../components/NumberFormat'
import NavBarVenda from '../../components/NavBarVenda'


export default () => {
  const history = useHistory()

  const [modalShowProduto, setModalShowProduto] = React.useState(false)
  const [modalShowCliente, setModalShowCliente] = React.useState(false)

  const [produtos, setProdutos] = useState([])
  const [selectedProduto, setSelectedProduto] = useState({})

  const [clientes, setClientes] = useState([])
  const [selectedCliente, setSelectedCliente] = useState({})

  const [quantidade, setQuantidade] = useState({
    value: '1',
    formattedValue: '1',
    floatValue: 1
  })
  const [listaPedido, setListaPedido] = useState([])
  const [data, setData] = useState()
  const [valorTotal, setValorTotal] = useState(0)

  useEffect( () => {
    setData( new Date().toISOString().substring(0,10) )
  }, [])

  useEffect(() => {
    const total = listaPedido.reduce((acc, item) => (acc + item.amount), 0)
    setValorTotal(total)
  }, [listaPedido])

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/stock")
      const serializeStock = response.data.stocks.filter((item) => (item.sale_amount < item.quantity_purchase))
      console.log(serializeStock)
      setProdutos(serializeStock)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/client")
      setClientes(response.data.clients)
    }
    fetchData()
  }, [])

  const handleAdicionar = () => {

    if (!selectedProduto.description) {
      toast.warning('Selecione um produto e confira a quantidade antes de adicionar a lista.')
      return
    }

    const pedido = {
      stock: selectedProduto,
      quantity: quantidade.floatValue,
      amount: parseFloat((selectedProduto.sale_value * quantidade.floatValue).toFixed(2))
    }

    console.log(pedido)

    setListaPedido([pedido, ...listaPedido])
    setSelectedProduto({})
    setQuantidade({
      value: '1',
      formattedValue: '1',
      floatValue: 1
    })
  }

  const handleSelectedProduto = (selected) => {
    setSelectedProduto(selected.row)
    const estoque = parseFloat(selected.row.quantity_purchase - selected.row.sale_amount)
    setQuantidade({
      formattedValue: estoque,
      floatValue: parseFloat(estoque),
      value: parseFloat(estoque)
    })
  }

  const handleSelectedCliente = (selected) => {
    setSelectedCliente(selected.row)
  }

  const handleFinalizarPedido = async () => {
    const orcamento = {
      client: selectedCliente,
      created_at: data,
      amount: valorTotal,
      wish_list: listaPedido
    }
    const response = await api.post('/budget', orcamento)

    if (response.status === 200) {
      toast.success(response.data.message)
      history.push(`/venda/fechamentodevenda/${response.data.id}`)
    } else {
      toast.error(response.data.message)
      return
    }

  }

  return (
    <div className='container-fluid'>
      <NavBarVenda
        title="Ponto de Venda"
        quantidadeDeItens={listaPedido.length}
        valorTotal={<NumberFormat value={valorTotal} />}
      />

      <div className="row">
        <div className="col-3">
          <form>

            <InputFormControl
              label='Data'
              className='form-control form-control-lg'
              type='date'
              id='inputData'
              value={data}
              onChange={(event) => setData(event.target.value)}
            />

            <InputFormControl
              label='Produto'
              className='form-control form-control-lg'
              id='inputProduto'
              value={selectedProduto.description || ''}
              readOnly
            >
              <Button variant="secondary" size='lg' onClick={() => setModalShowProduto(true)}>
                <IconList size='22px' title='Pesquisar Produto' />
              </Button>
            </InputFormControl>

            <ModalCenterBootstrapTable
              title='Lista do Estoque'
              show={modalShowProduto}
              dataList={produtos}
              onSelected={handleSelectedProduto}
              onHide={() => setModalShowProduto(false)}
            >
              <TableHeaderColumn dataField="id" isKey={true} width='10%' >#</TableHeaderColumn>
              <TableHeaderColumn dataField="description" >Descrição</TableHeaderColumn>
              <TableHeaderColumn dataField="detail" width='20%'>Detalhe</TableHeaderColumn>
            </ModalCenterBootstrapTable>

            <InputNumberFormat
              label='Quantidade'
              className="form-control form-control-lg"
              id='inputQuantidade'
              name='inputQuantidade'
              prefix=''
              value={quantidade.formattedValue}
              onValueChange={(values) => setQuantidade(values)}
            />
          </form>
          <div className="row justify-content-between p-3">
            <label>Valor Unit.</label>
            <h3 className='text-muted'><NumberFormat value={selectedProduto.sale_value || 0} /></h3>
          </div>
          <div className="row justify-content-between p-3">
            <label>Valor</label>
            <h2><NumberFormat value={(selectedProduto.sale_value * quantidade.floatValue) || 0} /></h2>
          </div>
          <div className='d-flex justify-content-end'>
            <Button variant="success"
              size='lg'
              onClick={handleAdicionar}
            > Adicionar </Button>
          </div>

          {
            listaPedido.length === 0 || !selectedCliente.name ? '' :
              <div className='btn-group d-flex justify-content-end mt-5'>

                <Button variant="primary"
                  size='lg'
                  onClick={handleFinalizarPedido}
                >Finalizar o Pedido</Button>
              </div>
          }
        </div>

        <div className="col-9">

          <InputFormControl
            label='Cliente'
            className='form-control form-control-lg'
            id='inputCliente'
            value={selectedCliente.name || ''}
            readOnly
          >
            <Button variant="secondary" size='lg' className='px-4' onClick={() => setModalShowCliente(true)}>
              <IconList size='22px' title='Pesquisar Cliente' />
            </Button>
            <Button variant="secondary" size='lg' onClick={() => history.push('/cliente/register')}>Criar</Button>
          </InputFormControl>

          <ModalCenterBootstrapTable
            title='Lista de Clientes'
            show={modalShowCliente}
            dataList={clientes}
            onSelected={handleSelectedCliente}
            onHide={() => setModalShowCliente(false)}
          >
            <TableHeaderColumn dataField="id" isKey={true} width='10%' >#</TableHeaderColumn>
            <TableHeaderColumn dataField="name" >Nome</TableHeaderColumn>
            <TableHeaderColumn dataField="cpf" width='30%'>CPF</TableHeaderColumn>
          </ModalCenterBootstrapTable>

          <table className="table table-hover table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Produto (descrição)</th>
                <th scope="col" className='text-right'>Qt.</th>
                <th scope="col" className='text-right'>Valor Unit.</th>
                <th scope="col" className='text-right'>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {
                listaPedido.map(
                  (item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <Button variant="danger"
                          onClick={() => (setListaPedido(
                            listaPedido.filter((pedido) => (pedido !== item))
                          ))}>
                          <IconRemoveList size='15px' title='Revomer produto da lista' />
                        </Button>
                      </th>
                      <td>{item.stock.description}</td>
                      <td className='text-right'><NumberFormat prefix='' value={item.quantity} /></td>
                      <td className='text-right'><NumberFormat value={item.stock.sale_value} /></td>
                      <td className='text-right'><NumberFormat value={item.amount} /></td>
                    </tr>
                  )
                )
              }
            </tbody>
          </table>
        </div >
      </div>
    </div>
  )
}
