import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit";


import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

const { SearchBar } = Search;

function BootstrapPaginationSearchDataTable({onSelect,...props}) {

  const selectRow = {
    mode: "radio",
    bgColor: "rgba(0,123,255,.4)",
    onSelect,
    clickToSelect: true,
  };

  

  return (
    <ToolkitProvider
      {...props}
      bootstrap4={true}
      loading={true}
      search
    >
      {(props) => (
        <div>
        {}
          <div className="d-flex justify-content-end">
            <SearchBar {...props.searchProps} />
          </div>

          <BootstrapTable
            {...props.baseProps}
            pagination={paginationFactory()}
            hover
            selectRow={selectRow}
          />
        </div>
      )}
    </ToolkitProvider>
  );
}

export default BootstrapPaginationSearchDataTable;
