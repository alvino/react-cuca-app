import React from 'react'
import { BootstrapTable } from 'react-bootstrap-table'
import {
    Modal
} from 'react-bootstrap'


export default function ModalCenterBootstrapTable(props) {
    function onRowSelect(row, isSelected) {
        props.onSelected({ row, isSelected })
        props.onHide()
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
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter"> {props.title} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BootstrapTable
                    version="4"
                    data={props.dataList}
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
