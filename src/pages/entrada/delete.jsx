import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify";
import api from '../../server/api'
import { Button } from 'react-bootstrap'

import NumberFormat from '../../components/NumberFormat'
import DateFormat from '../../components/DateFormat'

export default () => {
    const history = useHistory()
    const { id } = useParams(0)

    const [venda, setVenda] = useState({})

    useEffect(() => {        
        async function apiShow() {
            const response = await api.get(`/sale/${id}`)
            if (response.status === 500) {
                toast.error('Venda não encontrado')
                history.push('/entrada')
                return
            }
            setVenda(response.data.sale)
            toast.info(response.data.message)
        }
        apiShow()
    }, [history, id])

    const handleSubmit = ( async (event) => {
        event.preventDefault();
        const response = await api.delete(`/sale/${id}`)
        toast.success(response.data.message);
        history.push("/entrada");
    }, [])


    return (
        <div>
            <h2>Tem certeza que deseja deletar:</h2>
            <div className="mt-4 mb-4 justify-content-center">
                <p >Codigo: {venda.id}</p>

                <p>Descrição: {venda.description}</p>

                <p>Parcela: {`${venda.parcel} de ${venda.all_parcel}`}</p>

                <p>Valor: <NumberFormat value={venda.amount}/> </p>

                <p>Data para receber: <DateFormat value={venda.date_sale} /> </p>

                <p>Data da venda: <DateFormat value={venda.created_at} /></p>
            </div>
            <Button variant="danger" size='lg' onClick={handleSubmit}>
                Confirmar remoção
            </Button>
        </div>
    )
}

