import React from 'react'
import {
    NavLink,
} from "react-router-dom";

import Header from './Header'

function LiNavLink(props) {
    return (
        <li className="nav-item">
            <NavLink activeClassName='active' className="nav-link" to={props.to}>{props.title}</NavLink>
        </li>
    )
}


export default function NavBar() {
    return (
        <Header
            logoWidth='120px'
        >
            <LiNavLink to='/cliente' title='Cliente' />
            <LiNavLink to='/fornecedor' title='Fornecedor' />
            <LiNavLink to='/estoque' title='Estoque' />
            <LiNavLink to='/orcamento' title='Orçamento' />
            <LiNavLink to='/entrada' title='Entrada' />
        </Header>
    )
}
