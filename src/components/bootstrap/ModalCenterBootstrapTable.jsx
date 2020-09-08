import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { BsListUl as IconList } from "react-icons/bs";

import BootstrapDataTable from "./DataTable";

export default function ModalCenterBootstrapTable({
  onSelected,
  data,
  title,
  isShow,
  disable,
  children,
}) {
  const [show, setShow] = useState(false);

  if (isShow) handleShow();

  function handleClose() {
    setShow(false);
  }
  function handleShow() {
    setShow(true);
  }

  function onSelect(row, isSelected) {
    onSelected(row, isSelected);
    handleClose();
  }

  return (
    <>
      <button
        className={`btn btn-secondary px-4`}
        onClick={handleShow}
        disabled={disable}
      >
        <IconList size="22px" title="Pesquisar Cliente" />
      </button>

      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapDataTable data={data} onSelect={onSelect} exportCSV={false}>
            {children}
          </BootstrapDataTable>
        </Modal.Body>
      </Modal>
    </>
  );
}

ModalCenterBootstrapTable.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
