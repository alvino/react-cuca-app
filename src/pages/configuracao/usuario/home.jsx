import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../../../services/api";
import { useHistory } from "react-router-dom";
import { TableHeaderColumn } from "react-bootstrap-table";

import BootstrapDataTable from "../../../components/patterns/DataTable";
import { toast } from "react-toastify";

export default () => {
  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const adminCheckRef = useRef();

  const [users, setUsers] = useState([]);
  const [rowSelected, setRowSelected] = useState({
    row: {},
    isSelected: false,
  });

  async function fetchUser() {
    try {
      const response = await api.get("/user");
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Erro de rede ao acessar API");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const initFormulario = useCallback(() => {
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    adminCheckRef.current.checked = false;
  }, []);

  useEffect(() => {
    if (!rowSelected.isSelected) {
      initFormulario();
      return;
    }

    emailInputRef.current.value = rowSelected.row.email;
    adminCheckRef.current.checked = rowSelected.row.admin;
  }, [initFormulario, rowSelected]);

  async function handlerCadastraUsuario() {
    let user = {};

    if (rowSelected.isSelected) user = rowSelected.row;

    user.email = emailInputRef.current.value;
    user.password = passwordInputRef.current.value;
    user.admin = adminCheckRef.current.checked;

    const response = !rowSelected.isSelected
      ? await api.post("/user", user)
      : await api.put(`/user/${user.id}`, user);

    if (response.status === 200) {
      toast.info("Salvo com sucesso");
      initFormulario();
    } else {
      toast.error("Erro ao Salvar usuario");
      return;
    }

    fetchUser()
  }

  const onSelect = useCallback((row, isSelected) => {
    setRowSelected({ row, isSelected });
  }, []);

  const boolFormatter = (cell, row) => {
    return cell ? "Sim" : "Não";
  };

  return (
    <div className="row">
      <div className="col-4">
        <div className="my-2">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Usuario"
              ref={emailInputRef}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Senha"
              ref={passwordInputRef}
            />
          </div>
          <div className="form-check">
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                checked="false"
                ref={adminCheckRef}
                id="adminSwitch" />
              <label
                class="custom-control-label"
                for="adminSwitch"
              >
                Admin
              </label>
            </div>
          </div>
          <div className="btn-group " role="group">
            <button
              className="btn btn-primary p-2"
              onClick={handlerCadastraUsuario}
            >
              Cadastra Usuario
          </button>

            {rowSelected.isSelected ? (
              <>
                <button
                  className="btn btn-danger p-2"
                  onClick={() =>
                    history.push(
                      `/configuracao/usuario/delete/${rowSelected.row.id}`
                    )
                  }
                >
                  Deletar Usuario
              </button>
              </>
            ) : (
                ""
              )}
          </div>
        </div>
      </div>
      <div className="col">
        <BootstrapDataTable data={users} onSelect={onSelect} exportCSV={false}>
          <TableHeaderColumn dataField="email" isKey dataSort>
            Usuario
          </TableHeaderColumn>
          <TableHeaderColumn dataField="password" >
            Senha
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="admin"
            width="15%"
            dataSort
            dataFormat={boolFormatter}
          >
            Admin
          </TableHeaderColumn>
        </BootstrapDataTable>
      </div>
    </div>
  );
};
