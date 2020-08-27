import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";


import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

function BootstrapPaginationExportSearchDataTable({onSelect,...props}) {

  const selectRow = {
    mode: "radio",
    bgColor: "rgba(0,123,255,.4)",
    onSelect,
    clickToSelect: true,
  };

  

  return (
    <ToolkitProvider
      {...props}
      bootstrap4
      loading={true}
      search
      exportCSV
    >
      {(props) => (
        <div>
        
          <div className="d-flex justify-content-between">
            <ExportCSVButton
              {...props.csvProps}
              className="btn btn-outline-success btn-sm"
            >
              Export CSV!!
            </ExportCSVButton>
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

export default BootstrapPaginationExportSearchDataTable;
