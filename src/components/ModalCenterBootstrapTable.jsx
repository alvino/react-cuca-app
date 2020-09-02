import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

import BootstrapDataTable from "../components/bootstrap/DataTable";

export default function ModalCenterBootstrapTable({
  onSelected,
  onHide,
  data,
  title,
  children,
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
        <BootstrapDataTable data={data} onSelect={onSelect} exportCSV={false} >
          {children}
        </BootstrapDataTable>
      </Modal.Body>
    </Modal>
  );
}

ModalCenterBootstrapTable.propTypes = {
    data: PropTypes.array.isRequired,
}
