import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import Logo from "../Logo"

function Header(props) {
  return (
    <Navbar bg="primary" variant="dark" className="shadow sticky-top mb-5">
      <Link to="/" className="navbar-brand">
        <Logo width={props.logoWidth} />
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">{props.children}</Nav>
      </Navbar.Collapse>
      <Link class="btn btn-outline-light" to="/sobre">
        Sobre
      </Link>
    </Navbar>
  );
}

Header.defaultProps = {
  logoWidth: "180px",
};

export default React.memo(Header)