import React, { useRef } from "react";
import { BootstrapTable } from "react-bootstrap-table";

import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";

DataTable.defaultProps = {
  version: "4",
  pagination: true,
  hover: true,
  bordered: false,
  search: true,
  exportCSV: true,
  size: "sm",
};

function DataTable({ onSelect, children, ...props }) {
  const tableRef = useRef(null);

  if (onSelect) {
    props.selectRow = {
      mode: "radio",
      bgColor: "rgba(0,123,255,.4)",
      onSelect,
      clickToSelect: true,
    };
  }

  return (
    <BootstrapTable ref={tableRef} {...props}>
      {children}
    </BootstrapTable>
  );
}

export default React.memo(DataTable);
