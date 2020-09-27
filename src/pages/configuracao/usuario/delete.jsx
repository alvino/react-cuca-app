import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { Button } from "react-bootstrap";

export default () => {
  const history = useHistory();
  const { id } = useParams(0);

  const [usuario, setUsuario] = useState({email:'', admin: false});

  useEffect(() => {
    if (!id) {
      history.goBack();
      return;
    }

    async function fetch() {
      try {
        const response = await api.get(`/user/${id}`);
        const user = response.data.user;
        if (!user) {
          toast.error("usuario não encontrado");
          history.goBack();
          return;
        }
        setUsuario(user);
      } catch (error) {
        toast.error("erro de rede ao acessar API");
      }
    }

    fetch();
  }, [history, id]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const response = await api.delete(`/user/${id}`);
      if(response.status >= 500){
        toast.error("erro interno no servidor ao detetar usuario")
        return
      }
      toast.success("usuario deletado");
      history.goBack();
    },
    [history, id]
  );

  return (
    <div>
      <h2>Tem certeza que deseja deletar:</h2>
      <div className="mt-4 mb-4 justify-content-center">
        <p>Usuario: {usuario.email}</p>

        <p>Admin: {usuario.admin}</p>
      </div>
      <Button variant="danger" onClick={handleSubmit}>
        Confirmar remoção
      </Button>
    </div>
  );
};
