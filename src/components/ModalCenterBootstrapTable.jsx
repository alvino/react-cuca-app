import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

import BootstrapPaginationSearchDataTable from "../components/bootstrap/BootstrapPaginationSearchDataTable";

export default function ModalCenterBootstrapTable({
  onSelected,
  onHide,
  data,
  title,
  keyField,
  columns,
  ...props
}) {

  function onSelect(row, isSelected) {
    onSelected(row, isSelected);
    onHide();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"> {title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BootstrapPaginationSearchDataTable
          keyField={keyField}
          data={data}
          onSelect={onSelect}
          columns={columns}
          hover
        />
      </Modal.Body>
    </Modal>
  );
}

ModalCenterBootstrapTable.propTypes = {
    keyField: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
}
