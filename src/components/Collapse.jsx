import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import $ from "jquery";

import "bootstrap/js/dist/collapse";

function Collapse(props) {
  const [filter, setFilter] = useState(props.isFilter);

  useEffect(() => {
    if (props.isFilter) return;
    $(".collapse").collapse("toggle");
  }, [props.isFilter]);

  useEffect(() => {
    props.handlerFilter(filter);
  }, [filter, props]);

  return (
    <div className="my-2">
      <div className="collapse my-2" id="collapseFilter">
        {props.children}
      </div>
      <button
        className="btn btn-secondary"
        type="button"
        data-toggle="collapse"
        data-target="#collapseFilter"
        aria-expanded={filter}
        aria-controls="collapseFilter"
        onClick={() => setFilter(!filter)}
      >
        {filter ? "Filtrar" : "Sem Filtro"}
      </button>
    </div>
  );
}

Collapse.prototype = {
  isFilter: PropTypes.bool.isRequired,
  handlerFilter: PropTypes.func.isRequired,
};

export default Collapse;
