import React from "react";
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
  onRowClick: null,
};

function DataTable({ onSelect, children, onRowClick, ...props }) {
  
  if (onSelect) {
    props.selectRow = {
      mode: "radio",
      bgColor: "rgba(0,123,255,.4)",
      onSelect,
      clickToSelect: true,
    };
  }

  return (
    <BootstrapTable
      {...props}
      options={{
        noDataText: "Não possui dados para mostra.",
        onRowClick,
      }}
    >
      {children}
    </BootstrapTable>
  );
}

export default React.memo(DataTable);
