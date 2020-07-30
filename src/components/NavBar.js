import React from 'react'
import {
    NavLink,
} from "react-router-dom";

import Header from './Header'

export default function NavBar() {
    return (
        <div className="sticky-top">
            <Header>
                <li className="nav-item">
                    <NavLink activeClassName='active' className="nav-link" to="/cliente">Cliente</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink activeClassName='active' className="nav-link" to="/fornecedor">Fornecedor</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink activeClassName='active' className="nav-link" to="/estoque">Estoque</NavLink>
                </li>
            </Header>
        </div>
    )
}
