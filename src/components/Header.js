import React from "react";
import { Link } from 'react-router-dom'

import logoCuca from '../assert/logo_cuca.svg'


export default function Header(props) {

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow p-2 mb-3">
      <Link to='/' className='text-white'>
        <img src={logoCuca} width='120px' alt="Logo" />
      </Link>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {props.children}
        </ul>
      </div>
    </nav>



  )
}