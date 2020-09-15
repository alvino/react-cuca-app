import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsTrashFill as IconRemoveList } from "react-icons/bs";
import { toast } from "react-toastify";
import { TableHeaderColumn } from "react-bootstrap-table";

import api from "../../server/api";
import ModalCenterBootstrapTable from "../../components/patterns/ModalCenterBootstrapTable";
import BootstrapDataTable from "../../components/patterns/DataTable";
import {
  numberFormatter,
  priceFormatter,
} from "../../utils/react-bootstrap-table-formatted";
import InputFormControl from "../../components/InputFormControl";
import InputNumberFormat from "../../components/InputNumberFormat";

export default () => {
  const history = useHistory();

  const [providers, setProviders] = useState([]);
  const [selectedFornecedor, setSelectedFornecedor] = useState({});
   
  const descriptionInputRef = useRef()
  const detailInputRef = useRef()
  const unitInputRef = useRef()
  const [quantity, setQuantity] = useState({
    formattedValue: "0",
    value: "0",
    floatValue: 0,
  });
  const [purchasePrice, setPurchasePrice] = useState({
    formattedValue: "0",
    value: "0",
    floatValue: 0,
  });
  const [saleValue, setSaleValue] = useState({
    formattedValue: "0",
    value: "0",
    floatValue: 0,
  });

  const [listaProdutos, setListaProdutos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/provider");
      setProviders(response.data.providers);
    }
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFornecedor.id) {
      toast.warning("Selecione um fornecedor existente.");
      return;
    }

    const newStock = {
      index: listaProdutos.length + 1,
      provider_id: selectedFornecedor.id,
      description: descriptionInputRef.current.value,
      detail: detailInputRef.current.value,
      unit: unitInputRef.current.value,
      quantity: quantity.floatValue,
      purchase_price: purchasePrice.floatValue,
      sale_value: saleValue.floatValue,
    };

    if (
      newStock.description === "" ||
      newStock.quantity === "" ||
      newStock.purchase_price === "" ||
      newStock.sale_value === ""
    ) {
      toast.warning("Preencha os campos para depois adicionar a lista.");
      return;
    }

    setListaProdutos([newStock, ...listaProdutos]);
    
    descriptionInputRef.current.value = ''
    detailInputRef.current.value = ''
    unitInputRef.current.value = ''
    setQuantity({ formattedValue: "0", value: "0", floatValue: 0 });
    setPurchasePrice({ formattedValue: "0", value: "0", floatValue: 0 });
    setSaleValue({ formattedValue: "0", value: "0", floatValue: 0 });
  };

  const handleSelectedFornecedor = (selected) => {
    setSelectedFornecedor(selected);
  };

  const handleSaveListStock = async () => {
    const res = await api.post(
      "/stock",
      listaProdutos.map(item => ({
        provider_id: selectedFornecedor.id,
        description: descriptionInputRef.current.value,
        detail: detailInputRef.current.value,
        unit: unitInputRef.current.value,
        quantity: quantity.floatValue,
        purchase_price: purchasePrice.floatValue,
        sale_value: saleValue.floatValue,
      }))
    );
    toast.success(res.data.message);
    history.goBack();
  };

  

  return (
    <div className="row">
      <div className="col-4">
        <InputFormControl
          label="Fornecedor"
          id="inputFornecedor"
          name="inputFornecedor"
          value={selectedFornecedor.nickname || ""}
          readOnly
        >
          <ModalCenterBootstrapTable
            title="Lista de Fornecedores"
            data={providers}
            onSelected={handleSelectedFornecedor}
          >
            <TableHeaderColumn dataField="id" isKey width="10%">
              #
            </TableHeaderColumn>
            <TableHeaderColumn dataField="nickname">
              Descrição
            </TableHeaderColumn>
            <TableHeaderColumn dataField="cnpj" width="20%">
              CNPJ/CPF
            </TableHeaderColumn>
          </ModalCenterBootstrapTable>
          <button
            className="btn btn-secondary"
            onClick={() => history.push("/fornecedor/register")}
          >
            Criar
          </button>
        </InputFormControl>

        <div className="form-group">
          <label htmlFor="inputDescription">Descrição</label>
          <input
            type="text"
            className="form-control"
            id="inputDescription"
            ref={descriptionInputRef}
          />
        </div>

        <div className="form-group">
          <label htmlFor="inputDetail">Detalhe</label>
          <input
            type="text"
            className="form-control"
            id="inputDetail"
            ref={detailInputRef}
          />
        </div>

        <div className="form-group">
          <label htmlFor="inputUnit">Unidade de Medida</label>
          <input
            type="text"
            className="form-control"
            id="inputUnit"
            ref={unitInputRef}
          />
        </div>

        <InputNumberFormat
          label="Quantidade"
          id="quantity"
          name="quantity"
          prefix=""
          value={quantity.formattedValue}
          onValueChange={(values) =>
            setQuantity(values)
          }
        />

        <InputNumberFormat
          label="Valor da Compra"
          id="purchase_price"
          name="purchase_price"
          value={purchasePrice.formattedValue}
          onValueChange={(values) => setPurchasePrice(values)}
        />

        <InputNumberFormat
          label="Valor de Venda"
          id="sale_value"
          name="sale_value"
          value={saleValue.formattedValue}
          onValueChange={(values) => setSaleValue(values)}
        />

        <div className="d-flex justify-content-end">
          <Button variant="success" onClick={handleSubmit}>
            Adicionar
          </Button>
        </div>
        {listaProdutos.length === 0 || (
          <Button variant="primary" onClick={handleSaveListStock}>
            Salvar Lista de Produtos
          </Button>
        )}
      </div>
      <div className="col-8">
        <BootstrapDataTable
          data={listaProdutos}
          pagination={false}
          search={false}
          exportCSV={false}
        >
          <TableHeaderColumn
            dataField="index"
            width="8%"
            isKey
            dataFormat={(cell, row) => (
              <span
                onClick={() =>
                  setListaProdutos(
                    listaProdutos.filter((stock) => stock !== row)
                  )
                }
              >
                <IconRemoveList title="Revomer produto da lista" color="red" />
              </span>
            )}
          >
            #
          </TableHeaderColumn>
          <TableHeaderColumn dataField="description">
            Produto (descrição)
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="quantity"
            width="10%"
            dataFormat={numberFormatter}
          >
            Qt.
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="purchase_price"
            width="15%"
            dataFormat={priceFormatter}
          >
            R$ Compra
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="sale_value"
            width="15%"
            dataFormat={priceFormatter}
          >
            R$ Venda
          </TableHeaderColumn>
        </BootstrapDataTable>
      </div>
    </div>
  );
};
