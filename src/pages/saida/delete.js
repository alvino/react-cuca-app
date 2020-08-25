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


    const [gasto, setGasto] = useState({})


    useEffect(() => {        
        async function apiShow() {
            const response = await api.get(`/outlay/${id}`)

            if (response.status === 500) {
                toast.error('Venda não encontrado')
                history.push('/saida')
                return
            }
            console.log(response.data)
            setGasto(response.data.outlay)
            toast.info(response.data.message)
        }

        apiShow()
        // eslint-disable-next-line
    }, [id])


    async function handleSubmit(event) {

        event.preventDefault();


        const response = await api.delete(`/outlay/${id}`)
        toast.success(response.data.message);


        history.push("/saida");
    }

    return (
        <div>
            <h2>Tem certeza que deseja deletar:</h2>
            <div className="mt-4 mb-4 justify-content-center">
                <p >Codigo: {gasto.id}</p>

                <p>Descrição: {gasto.description}</p>

                <p>Valor: <NumberFormat value={gasto.amount}/> </p>

                <p>Vencimento: <DateFormat value={gasto.date_outlay} /> </p>

                <p>Data de criação: <DateFormat value={gasto.created_at} /></p>
            </div>
            <Button variant="danger" size='lg' onClick={handleSubmit}>
                Confirmar remoção
            </Button>
        </div>
    )
}