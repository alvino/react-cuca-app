import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";
import { Button } from 'react-bootstrap'
import { TableHeaderColumn } from 'react-bootstrap-table'
import {
    BsListUl as IconList,
    BsTrashFill as IconRemoveList,
    BsPlus as IconAdd,
} from 'react-icons/bs'
import numeral from 'numeral'


import api from '../../server/api'
import ModalCenterBootstrapTable from '../../components/ModalCenterBootstrapTable'

import logoCuca from '../../assert/logo_cuca.svg'


export default () => {

    const [modalShowProduto, setModalShowProduto] = React.useState(false)
    const [modalShowCliente, setModalShowCliente] = React.useState(false)

    const [stock, setStock] = useState([])
    const [selectedProduto, setSelectedProduto] = useState({})

    const [client, setClient] = useState([])
    const [selectedCliente, setSelectedCliente] = useState({})

    const [quant, setQuant] = useState(1)

    const [listaPedido, setListaPedido] = useState([])

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("/stock")
            setStock(response.data.stocks)
        }
        fetchData()
    }, []);

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("/client")
            setClient(response.data.clients)
        }
        fetchData()
    }, []);

    const handleAdicionar = () => {

        if (!selectedProduto.description) {
            toast.warning('Selecione um produto e confira a quantidade antes de adicionar a lista.')
            return
        }

        const pedido = {
            row: selectedProduto,
            quantity: quant,
            amount: selectedProduto.sale_value * quant
        }
        setListaPedido([pedido, ...listaPedido])
        setSelectedProduto({ row: {}, isSelected: false })
        setQuant(1)
    }

    const handleSelectedProduto = (selected) => {
        setSelectedProduto(selected.row)
        setQuant(selected.row.quantity_purchase - selected.row.sale_amount)
    }

    const handleSelectedCliente = (selected) => {
        setSelectedCliente(selected.row)
    }

    return (
        <div className='container-fluid'>
            <div className="row p-3 mb-2 bg-primary text-white d-flex justify-content-between align-items-center sticky-top">
                <div className=''>
                    <Link to='/' className='text-white'>
                        <img src={logoCuca} width='120px' alt="Logo" />
                    </Link>
                    <h1 style={{ height: '32px', fontSize: '32px' }}>Ponto de Venda</h1>
                </div>
                <div className='mx-3 d-flex flex-column'>
                    <h4 >Itens:</h4>
                    <h2 className='text-right'>{listaPedido.length}</h2>
                </div>
                <div className='mx-3 d-flex flex-column'>
                    <h4> Valor total dos produtos:</h4>
                    <h2 className='text-right'>{
                        numeral(
                            listaPedido.reduce(
                                (acc, item) => (acc + item.amount)
                                , 0)
                        ).format('0,0.00')

                    }</h2>
                </div>
            </div>
            <div className="row ">
                <div className="col-3 p-3 mb-2 ">
                    <div>
                        <div className="form-group">
                            <label>Produto</label>
                            <div className="d-flex">

                                <input type="text"
                                    className="form-control form-control-lg"
                                    id='inputProduto'
                                    value={selectedProduto.description || ''}
                                    readOnly />
                                <Button variant="secondary" className='px-2' onClick={() => setModalShowProduto(true)}>
                                    <IconList size='22px' title='Pesquisar Produto' />
                                </Button>

                                <ModalCenterBootstrapTable
                                    show={modalShowProduto}
                                    dataList={stock}
                                    onSelected={handleSelectedProduto}
                                    onHide={() => setModalShowProduto(false)}
                                >
                                    <TableHeaderColumn dataField="id" isKey={true} width='10%' >#</TableHeaderColumn>
                                    <TableHeaderColumn dataField="description" >Descrição</TableHeaderColumn>
                                    <TableHeaderColumn dataField="detail" width='20%'>Detalhe</TableHeaderColumn>
                                </ModalCenterBootstrapTable>

                            </div>
                        </div>
                        <div className="form-group">
                            <label>Quantidade</label>

                            <input
                                type='text'
                                className="form-control form-control-lg"
                                id='inputQuantidade'
                                value={quant}
                                onChange={(event) => setQuant(event.target.value)} />


                        </div>
                        <div className="row justify-content-between p-3">
                            <label>Valor Unit.</label>
                            <h3 className='text-muted'>{numeral(selectedProduto.sale_value).format('0,0.00')}</h3>
                        </div>
                        <div className="row justify-content-between p-3">
                            <label>Valor</label>
                            <h2>{numeral(selectedProduto.sale_value * quant).format('0,0.00') || 0}</h2>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <Button variant="success"
                                className='px-5 py-2'
                                onClick={handleAdicionar}>
                                <IconAdd size='22px' />Adicionar
                            </Button>
                        </div>
                    </div>
                    {
                        listaPedido.length === 0 || !selectedCliente.name ? '' :

                            <div className='btn-group d-flex justify-content-end mt-5'>
                                <Button variant="secondary"
                                    className='px-5 py-2'
                                    onClick={() => ('')}>Imprimir Orcamento
                                </Button>
                                <Button variant="primary"
                                    className='px-5 py-2'
                                    onClick={() => ('')}>Finalizar Venda
                                </Button>
                            </div>
                    }
                </div>
                <div className="col-9 p-3 mb-2">

                    <div className=''>
                        <div className="form-group">
                            <label>Cliente</label>
                            <div className="d-flex">

                                <input type="text"
                                    className="form-control form-control-lg"
                                    id='inputCliente'
                                    value={selectedCliente.name || ''}
                                    readOnly />
                                <Button variant="secondary" className='px-2' onClick={() => setModalShowCliente(true)}>
                                    <IconList size='22px' title='Pesquisar Cliente' />
                                </Button>

                                <ModalCenterBootstrapTable
                                    show={modalShowCliente}
                                    dataList={client}
                                    onSelected={handleSelectedCliente}
                                    onHide={() => setModalShowCliente(false)}
                                >
                                    <TableHeaderColumn dataField="id" isKey={true} width='10%' >#</TableHeaderColumn>
                                    <TableHeaderColumn dataField="name" >Nome</TableHeaderColumn>
                                    <TableHeaderColumn dataField="cpf" width='30%'>CPF</TableHeaderColumn>
                                </ModalCenterBootstrapTable>

                            </div>
                        </div>
                    </div>
                    <table className="table table-hover">
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
                                            <td>{item.row.description}</td>
                                            <td className='text-right'>{item.quantity}</td>
                                            <td className='text-right'>{item.row.sale_value}</td>
                                            <td className='text-right'>{numeral(item.amount).format('0,0.00')}</td>
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div >
    )
}
