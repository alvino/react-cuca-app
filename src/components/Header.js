import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import logoCuca from "../assert/logo_cuca.svg";

export default function Header(props) {
  return (
    <Navbar bg="primary" variant="dark" className="shadow sticky-top mb-5">
      <Link to="/" className='navbar-brand'>
        <img src={logoCuca} width={props.logoWidth} alt="Logo" />
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">{props.children}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

Header.defaultProps = {
  logoWidth: "180px",
};
