import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify";
import api from '../../server/api'
import { Button } from 'react-bootstrap'

export default () => {
    const history = useHistory()
    const { id } = useParams(0)


    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        telephone: '',
        cnpj: '',
        bank_data: '',
    });

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");


    useEffect(() => {
        if (!id) {
            history.push("/provider")
            return
        }

        async function apiShow() {
            const response = await api.get(`/provider/${id}`)
            const [provider] = response.data.provider
            if (!provider) {
                toast.error('fornecedor não encontrado')
                history.push('/fornecedor/register')
                return
            }
            toast.info(response.data.message)
            setFormData({
                nickname: provider.nickname,
                email: provider.email,
                telephone: provider.telephone,
                cnpj: provider.cnpj,
                bank_data: provider.bank_data,
            })
            setSelectedUf(provider.uf)
            setSelectedCity(provider.city)
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
                <p >Razão: {formData.nickname}</p>

                <p>Email: {formData.email}</p>

                <p>Telefone: {formData.telephone}</p>

                <p>CNPJ: {formData.cnpj}</p>

                <p>Estado: {selectedUf}</p>

                <p>Cidade: {selectedCity}</p>

                <p>Dados Bancarios: {formData.bank_data}</p>
            </div>
            <Button variant="danger" size='lg' onClick={handleSubmit}>
                Confirmar remoção
            </Button>
        </div>
    )
}

