import React from "react";

import DateFormat from "../components/DateFormat";
import NumberFormat from "../components/NumberFormat";

function dateFormatter(cell, row){
  return <DateFormat value={cell} />;
};

function numberFormatter(cell, row){
  return <NumberFormat prefix='' value={parseFloat(cell)} />;
};

function priceFormatter(cell, row){
  return <NumberFormat value={parseFloat(cell)} />;
};

export {
  dateFormatter,
  numberFormatter,
  priceFormatter,
};
