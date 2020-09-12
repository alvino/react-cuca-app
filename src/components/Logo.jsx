import React from "react";
import { Link } from "react-router-dom";

import logoCuca from "../assert/logo_cuca.svg";

function Header(props) {
  return (

      <Link to="/" className='navbar-brand'>
        <img src={logoCuca} width={props.logoWidth} alt="Logo" />
      </Link>
 
  );
}

Header.defaultProps = {
  logoWidth: "180px",
};

export default React.memo(Header)