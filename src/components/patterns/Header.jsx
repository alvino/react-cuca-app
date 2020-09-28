import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { AiOutlineLogout } from "react-icons/ai";

import FontSizeChanger from "../FontSizeChanger";

import { logout } from "../../services/auth";

import Logo from "../Logo";

function Header(props) {
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  return (
    <Navbar bg="primary" variant="dark" className="shadow sticky-top mb-5">
      <Link to="/" className="navbar-brand">
        <Logo width={props.logoWidth} />
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">{props.children}</Nav>
      </Navbar.Collapse>

      <FontSizeChanger />
      <Link className="btn btn-outline-light mx-2" to="/sobre">
        Sobre
      </Link>
      <Link
        className="btn btn-outline-light mx-2"
        to="#"
        onClick={handleLogout}
      >
        <AiOutlineLogout size="1.2rem" />
      </Link>
    </Navbar>
  );
}

Header.defaultProps = {
  logoWidth: "180px",
};

export default React.memo(Header);
