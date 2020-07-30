import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../server/api'

export default () => {
    const history = useHistory()
    const { id } = useParams(0)


    const [formData, setFormData] = useState({
        description: '',
        detail: '',
        unit: '',
        quantity_purchase: '',
        sale_amount: '',
        purchase_price: '',
        sale_value: ''
    });


    useEffect(() => {
        if (!id) {
            history.push("/stock")
            return
        }

        async function apiShow() {
            const resStock = await api.get(`/stock/${id}`)
            const [stock] = resStock.data.stock
            toast.success(resStock.data.message)
            if (!stock) {
                history.push('/stock/register')
                return
            }
            setFormData({
                nickname: stock.nickname,
                description: stock.description,
                detail: stock.detail,
                unit: stock.unit,
                quantity_purchase: stock.quantity_purchase,
                sale_amount: stock.sale_amount,
                purchase_price: stock.purchase_price,
                sale_value: stock.sale_value
            })

        }

        apiShow()
        // eslint-disable-next-line
    }, [])


    async function handleSubmit(event) {
        event.preventDefault();

        const response = await api.delete(`/provider/${id}`)
        toast.success(response.data.message);

        history.push("/fornecedor");
    }

    return (
        <div>
            <h2>Tem certeza que deseja deletar:</h2>
            <div className="mt-4 mb-4 justify-content-center">
                <p>Fornecedor: {formData.nickname}</p>
                <p>Descrição: {formData.description}</p>
                <p>Detalhe: {formData.detail}</p>
                <p>Unidade: {formData.unit}</p>
                <p>Quantidade: {formData.quantity_purchase}</p>
                <p>Quantidade Vendida: {formData.sale_amount}</p>
                <p>Preço: {formData.purchase_price}</p>
                <p>Preço Venda: {formData.sale_value}</p>
            </div>
            <button className="btn btn-danger" onClick={handleSubmit}>
                Confirma deleta
            </button>
        </div>
    )
}

