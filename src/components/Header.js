import React from "react";
import { Link } from 'react-router-dom'
import {
  Navbar,
  Nav,
} from 'react-bootstrap'


import logoCuca from '../assert/logo_cuca.svg'


export default function Header(props) {

  return (
    <div className="sticky-top mb-5">

      <Navbar bg="primary" variant="dark" className='shadow'>
        <Navbar.Brand href="#home">
          <Link to='/'>
            <img src={logoCuca} width={props.logoWidth} alt="Logo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {props.children}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

    </div>
  )
}

Header.defaultProps = {
  logoWidth: '180px'
}