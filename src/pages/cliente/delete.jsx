import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify";
import api from '../../server/api'
import { Button } from 'react-bootstrap'

export default () => {
    const history = useHistory()
    const { id } = useParams(0)


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        telephone: "",
        cpf: "",
    });

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");


    useEffect(() => {
        if (!id) {
            history.push("/cliente")
            return
        }

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


    async function handleSubmit(event) {

        event.preventDefault();


        const response = await api.delete(`/client/${id}`)
        toast.success(response.data.message);


        history.push("/cliente");
    }

    return (
        <div>
            <h2>Tem certeza que deseja deletar:</h2>
            <div className="mt-4 mb-4 justify-content-center">
                <p >Nome: {formData.name}</p>

                <p>Email: {formData.email}</p>

                <p>Telefone: {formData.telephone}</p>

                <p>CPF: {formData.cpf}</p>

                <p>Estado: {selectedUf}</p>

                <p>Cidade: {selectedCity}</p>
            </div>
            <Button variant="danger" size='lg' onClick={handleSubmit}>
                Confirmar remoção
            </Button>
        </div>
    )
}

