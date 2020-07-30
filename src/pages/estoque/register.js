import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { TableHeaderColumn } from 'react-bootstrap-table'
import {
  BsListUl as IconList,
  BsPlus as IconAdd,
  BsTrashFill as IconRemoveList
} from 'react-icons/bs'
import numeral from 'numeral'
import { toast } from 'react-toastify'


import api from '../../server/api'
import ModalCenterBootstrapTable from '../../components/ModalCenterBootstrapTable'



export default () => {
  const history = useHistory()


  const [modalShowFornecedor, setModalShowFornecedor] = useState(false)
  const [providers, setProviders] = useState([])
  const [selectedFornecedor, setSelectedFornecedor] = useState({})


  const [formData, setFormData] = useState({
    description: '',
    detail: '',
    unit: '',
    quantity_purchase: '',
    purchase_price: '',
    sale_value: ''
  })
  const [listStock, setListStock] = useState([])


  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/provider")
      setProviders(response.data.providers)
    }
    fetchData()
  }, []);

  const actionChangeElementsValues = {
    description: (value) => setFormData({ ...formData, description: value }),
    detail: (value) => setFormData({ ...formData, detail: value }),
    unit: (value) => setFormData({ ...formData, unit: value }),
    quantity_purchase: (value) => setFormData({ ...formData, quantity_purchase: value }),
    purchase_price: (value) => setFormData({ ...formData, purchase_price: value }),
    sale_value: (value) => setFormData({ ...formData, sale_value: value }),
  };

  function handleChange(event) {
    actionChangeElementsValues[event.target.name](event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedFornecedor.id) {
      toast.warning('Selecione um fornecedor existente.')
      return
    }

    if (formData.description === ''
      || formData.quantity_purchase === ''
      || formData.purchase_price === ''
      || formData.sale_value === '') {
      toast.warning('Preencha os campos para depois adicionar a lista.')
      return
    }

    const newStock = {
      provider_id: selectedFornecedor.id,
      ...formData
    }

    setListStock([newStock, ...listStock])
    setFormData({
      description: '',
      detail: '',
      unit: '',
      quantity_purchase: '',
      purchase_price: '',
      sale_value: ''
    })
  }

  const handleSelectedFornecedor = (selected) => {
    setSelectedFornecedor(selected.row)
  }

  const handleSaveListStock = async () => {

    const res = await api.post("/stock", listStock)
    toast.success(res.data.message)

    history.push('/estoque')
  }

  return (
    <div className="row">
      <div className="col-4">
        <div className="form-group">
          <label>Fornecedor</label>
          <div className="d-flex">

            <input type="text"
              className="form-control form-control-lg"
              id='inputFornecedor'
              value={selectedFornecedor.nickname || ''}
              readOnly />
            <Button variant="secondary" className='px-2' onClick={() => setModalShowFornecedor(true)}>
              <IconList size='22px' title='Pesquisar Fornecedor' />
            </Button>

            <ModalCenterBootstrapTable
              show={modalShowFornecedor}
              dataList={providers}
              onSelected={handleSelectedFornecedor}
              onHide={() => setModalShowFornecedor(false)}
            >
              <TableHeaderColumn dataField="id" isKey={true} width='10%' >#</TableHeaderColumn>
              <TableHeaderColumn dataField="nickname" >Descrição</TableHeaderColumn>
              <TableHeaderColumn dataField="cnpj" width='20%'>Detalhe</TableHeaderColumn>
            </ModalCenterBootstrapTable>

          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <legend>Cadastro de Estoque </legend>

            <label htmlFor="inputDescricao">Descrição</label>
            <input
              className="form-control"
              type="text"
              name="description"
              id="inputDescricao"
              value={formData.description}
              onChange={handleChange}
            />

            <label htmlFor="inputDetalhe">Detalhe</label>
            <input
              className="form-control"
              type="text"
              name="detail"
              id="inputDetalhe"
              value={formData.detail}
              onChange={handleChange}
            />

            <label htmlFor="inputUnidade">Unidade Medida</label>
            <input
              className="form-control"
              type="text"
              name="unit"
              id="inputUnidade"
              value={formData.unit}
              onChange={handleChange}
            />

            <label htmlFor="inputQuantidade">Quantidade</label>
            <input
              className="form-control"
              type="text"
              name="quantity_purchase"
              id="inputQuantidade"
              value={formData.quantity_purchase}
              onChange={handleChange}
            />

            <label htmlFor="inputValorCompra">Valor da Compra</label>
            <input
              className="form-control"
              type="text"
              name="purchase_price"
              id="inputValorCompra"
              value={formData.purchase_price}
              onChange={handleChange}
            />

            <label htmlFor="inputValorVenda">Valor de Venda</label>
            <input
              className="form-control"
              type="text"
              name="sale_value"
              id="inputValorVenda"
              value={formData.sale_value}
              onChange={handleChange}
            />


          </div>
          <div className='d-flex justify-content-end'>
            <button type="submit" className="btn btn-success">
              <IconAdd size='22px' />Adicionar
            </button>
          </div>
        </form>
        {
          listStock.length === 0 ? '' :
            <button
              type="submit"
              className="btn-lg btn-primary"
              onClick={handleSaveListStock}>
              Salvar Lista de Produtos
            </button>
        }
      </div>
      <div className="col-8">

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" className='text-right'>For.</th>
              <th scope="col">Produto (descrição)</th>
              <th scope="col" className='text-right'>Valor Compra</th>
              <th scope="col" className='text-right'>Valor Venda</th>
            </tr>
          </thead>
          <tbody>
            {
              listStock.map(
                (item, index) => (
                  <tr key={index}>
                    <th scope="row">
                      <button
                        className='btn btn-danger'
                        onClick={() => (setListStock(
                          listStock.filter((pedido) => (pedido !== item))
                        ))}>
                        <IconRemoveList size='15px' title='Revomer produto da lista' />
                      </button>
                    </th>
                    <td className='text-right'>{item.provider_id}</td>
                    <td>{item.description}</td>
                    <td className='text-right'>{numeral(item.purchase_price).format('0,0.00')}</td>
                    <td className='text-right'>{numeral(item.sale_value).format('0,0.00')}</td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>

      </div>
    </div >
  );
}

