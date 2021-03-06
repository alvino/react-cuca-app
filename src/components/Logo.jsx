import React from "react";

import logoCuca from "../assert/logo_cuca.svg";

function Logo(props) {
  return <img src={logoCuca} width={props.width} alt="Logo" />;
}

Logo.defaultProps = {
  width: "120px",
};

export default React.memo(Logo);
