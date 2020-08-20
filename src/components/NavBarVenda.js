import React from 'react'
import { Link } from 'react-router-dom'


import logoCuca from '../assert/logo_cuca.svg'


export default function NavBarVenda(props) {
    return (
        <div className="row p-3 mb-2 bg-primary text-white d-flex justify-content-between align-items-center sticky-top">
            <div>
                <Link to='/' className='text-white'>
                    <img src={logoCuca} width='120px' alt="Logo" />
                </Link>
                <h3>{props.title}</h3>
            </div>
            <div className='mx-3 d-flex flex-column'>
                <h4 className='text-right' >Itens:</h4>
                <h2 className='text-right'>{props.quantidadeDeItens}</h2>
            </div>
            <div className='mx-3 d-flex flex-column'>
                <h4 className='text-right' > Valor total do pedido:</h4>
                <h2 className='text-right'>{props.valorTotal}</h2>
            </div>
        </div>
    )
}

