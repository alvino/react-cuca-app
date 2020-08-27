import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import {
  BsListUl as IconList,
  BsTrashFill as IconRemoveList
} from 'react-icons/bs'
import { toast } from 'react-toastify'


import api from '../../server/api'
import ModalCenterBootstrapTable from '../../components/ModalCenterBootstrapTable'
import InputFormControl from '../../components/bootstrap/InputFormControl'
import InputNumberFormat from '../../components/bootstrap/InputNumberFormat'
import NumberFormat from '../../components/NumberFormat'


const columnsProviders =[
  {
    dataField: 'id',
    text: '#',
    headerStyle: {width: '10%'}
  },
  {
    dataField: 'nickname',
    text: 'Descrição',
  },
  {
    dataField: 'cnpj',
    text: 'CNPJ/CPF',
    headerStyle: {width: '20%'}
  }
]


export default () => {
  const history = useHistory()


  const [modalShowFornecedor, setModalShowFornecedor] = useState(false)
  const [providers, setProviders] = useState([])
  const [selectedFornecedor, setSelectedFornecedor] = useState({})


  const [formData, setFormData] = useState({
    description: '',
    detail: '',
    unit: '',
    quantity_purchase: {
      value: '0'
    },
    purchase_price: {
      value: '0'
    },
    sale_value: {
      value: '0'
    }
  })
  const [listStock, setListStock] = useState([])


  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/provider")
      setProviders(response.data.providers)
    }
    fetchData()
  }, []);


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
      description: formData.description,
      detail: formData.detail,
      unit: formData.unit,
      quantity_purchase: formData.quantity_purchase.floatValue,
      purchase_price: formData.purchase_price.floatValue,
      sale_value: formData.sale_value.floatValue
    }

    setListStock([newStock, ...listStock])
    setFormData({
      description: '',
      detail: '',
      unit: '',
      quantity_purchase: { value: '0', formattedValue: '' },
      purchase_price: { value: '0', formattedValue: '' },
      sale_value: { value: '0', formattedValue: '' }
    })
  }

  const handleSelectedFornecedor = (selected) => {
    setSelectedFornecedor(selected.row)
  }

  const handleSaveListStock = async () => {

    const res = await api.post("/stock", listStock)
    toast.success(res.data.message)

    history.goBack()
  }

  return (
    <div className="row">
      <div className="col-4">

        <form>

          <InputFormControl
            label='Descrição'
            id="description"
            name="description"
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
          />

          <InputFormControl
            label='Detalhe'
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={(event) => setFormData({ ...formData, detail: event.target.value })}
          />

          <InputFormControl
            label='Unidade de Medida'
            id="unit"
            name='unit'
            value={formData.unit}
            onChange={(event) => setFormData({ ...formData, unit: event.target.value })}
          />

          <InputNumberFormat
            label='Quantidade'
            id="quantity_purchase"
            name="quantity_purchase"
            prefix=''
            value={formData.quantity_purchase.formattedValue}
            onValueChange={(values) => setFormData({ ...formData, quantity_purchase: values })}
          />

          <InputNumberFormat
            label='Valor da Compra'
            id="purchase_price"
            name="purchase_price"
            value={formData.purchase_price.formattedValue}
            onValueChange={(values) => setFormData({ ...formData, purchase_price: values })}
          />

          <InputNumberFormat
            label='Valor de Venda'
            id="sale_value"
            name="sale_value"
            value={formData.sale_value.formattedValue}
            onValueChange={(values) => setFormData({ ...formData, sale_value: values })}
          />

          <div className='d-flex justify-content-end'>
            <Button
              variant='success'
              size='lg'
              onClick={handleSubmit}>
              Adicionar
            </Button>

          </div>
        </form>
        {
          listStock.length === 0 ? '' :
            <Button
              variant="primary"
              size='lg'
              onClick={handleSaveListStock}>
              Salvar Lista de Produtos
            </Button>
        }
      </div >
      <div className="col-8">

        <InputFormControl
          label='Fornecedor'
          className="form-control form-control-lg"
          id='inputFornecedor'
          value={selectedFornecedor.nickname || ''}
          readOnly
        >
          <Button variant="secondary" className='px-4' onClick={() => setModalShowFornecedor(true)}>
            <IconList size='22px' title='Pesquisar Fornecedor' />
          </Button>
          <Button variant="secondary" size='lg' onClick={() => history.push('/fornecedor/register')}>Criar</Button>
        </InputFormControl>


        <ModalCenterBootstrapTable
          title='Lista de Fornecedores'
          show={modalShowFornecedor}
          data={providers}
          onSelected={handleSelectedFornecedor}
          onHide={() => setModalShowFornecedor(false)}
          keyField='id'
          columns={columnsProviders}
        />
         


        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col" style={{ width: '5%' }}>For.</th>
              <th scope="col">Produto (descrição)</th>
              <th scope="col" style={{ width: '5%' }}>Qt.</th>
              <th scope="col" style={{ width: '15%' }} className='text-right'>Valor Compra</th>
              <th scope="col" style={{ width: '15%' }} className='text-right'>Valor Venda</th>
            </tr>
          </thead>
          <tbody>
            {
              listStock.map(
                (item, index) => (
                  <tr key={index}>
                    <th scope="row">
                      <Button
                        variant='danger'
                        onClick={() => (setListStock(
                          listStock.filter((pedido) => (pedido !== item))
                        ))}>
                        <IconRemoveList size='15px' title='Revomer produto da lista' />
                      </Button>
                    </th>
                    <td className='text-right'>{item.provider_id}</td>
                    <td>{item.description}</td>
                    <td>
                      <NumberFormat value={item.quantity_purchase} prefix='' />
                    </td>
                    <td className='text-right'>
                      <NumberFormat value={item.purchase_price} />
                    </td>
                    <td className='text-right'>
                      <NumberFormat value={item.sale_value} />
                    </td>
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

