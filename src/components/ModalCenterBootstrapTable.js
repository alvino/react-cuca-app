import React from 'react'
import { BootstrapTable } from 'react-bootstrap-table'
import {
    Modal
} from 'react-bootstrap'


export default function ModalCenterBootstrapTable({onSelected, onHide, data, title, ...props}) {
    function onRowSelect(row, isSelected) {
        onSelected(row, isSelected)
        onHide()
    }

    const selectRow = {
        mode: "radio",//"checkbox",
        bgColor: "rgba(0,123,255,.4)",
        onSelect: onRowSelect,
        clickToSelect: true,
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
                <BootstrapTable
                    version="4"
                    data={data}
                    selectRow={selectRow}
                    pagination
                    search
                    hover
                    ignoreSinglePage
                >

                    {props.children}

                </BootstrapTable>
            </Modal.Body>
        </Modal>
    );
}
