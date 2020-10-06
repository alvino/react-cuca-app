import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";


import api from "../../services/api";

import InputNumberFormat from "../../components/InputNumberFormat";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [stock, setStock] = useState([]);

  const descriptionInputRef = useRef();
  const detailInputRef = useRef();
  const unitInputRef = useRef();
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

  useEffect( () => {
    descriptionInputRef.current.value = stock.description
    detailInputRef.current.value = stock.detail
    unitInputRef.current.value = stock.unit
    setQuantity({
      formattedValue: stock.quantity,
      floatValue: stock.quantity,
    });
    setPurchasePrice({
      formattedValue: stock.purchase_price,
      floatValue: stock.purchase_price,
    });
    setSaleValue({
      formattedValue: stock.sale_value,
      floatValue: stock.sale_value,
    });
  }, [stock])

  useEffect(() => {
    if( id === '0') return

    async function fetchData() {
      const response = await api.get(`stock/${id}`);
      const data = response.data.stock
      data.quantity -= data.quantity_of
      setStock(response.data.stock);
    }
    fetchData();
  }, [id]);



  const handleSubmit = async (event) => {
    event.preventDefault();

    const newStock = {
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

    let response = null
    if(stock.quantity_of === 0) {
      response = await api.put(`stock/${id}`, newStock)
    } else {
      newStock.provider_id = stock.provider_id
      response = await api.put(`stock/${id}`, {quantity: stock.quantity_of})
      response = await api.post(`stock`, newStock)
    }
    if (response.status > 500) {
      toast.error("erro interno no servidor ao cadastra produto no estoque");
      return;
    }

    toast.success("produto cadastrado com sucesso");
    newStock.id = response.data.stock_id;

    history.push('/estoque')

  };


  return (
    <>
      <div >
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
            onValueChange={(values) => setQuantity(values)}
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

          <div className="d-flex justify-content-start">
            <Button variant="info" onClick={handleSubmit}>
              Alterar
            </Button>
          </div>
        
        
          
      </div>
    </>
  );
};
