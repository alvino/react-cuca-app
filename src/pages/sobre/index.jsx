import React, { useEffect, useState, useRef } from "react";

import api from "../../services/api";
import github from "../../services/github";

import NavBar from "../../components/NavBar";

import iconUser from "../../assert/user-icon.png";
import { toast } from "react-toastify";

export default () => {
  const [apiGit, setApiGit] = useState({
    avatar_url: iconUser,
    name: "Name",
    company: "company",
    location: "...",
    bio: "...",
  });

  const emailInputRef = useRef();
  const messageTextRef = useRef();

  useEffect(() => {
    async function fetch() {
      const response = await github.get(`users/alvino`);
      const { avatar_url, name, location, company, bio } = response.data;
      setApiGit({ avatar_url, name, location, company, bio });
    }

    fetch();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailInputRef.current.value;
    const message = messageTextRef.current.value;

    try {
      const response = await api.post(`send`, { email, message });

      if (response.status > 500) throw new Error("");

      toast.info("Em viado...");

      emailInputRef.current.value = "";
      messageTextRef.current.value = "";
    } catch (error) {
      toast.error("Não foi possivel enviar email");
    }
  };

  return (
    <div>
      <NavBar />

      <div className="container-fluid">
        <main>
          <div className="row">
            <div className="col-3" />

            <div className="col-6">
              <div className="d-flex">
                <div className="m-2">
                  <p>{apiGit.name}</p>
                  <p>{apiGit.company}</p>
                  <p>{apiGit.location}</p>
                  <p>{apiGit.bio}</p>
                </div>
                <div className="justify-content-center align-items-centerw m-2">
                  <img
                    src={apiGit.avatar_url}
                    width="100px"
                    className="rounded mx-auto d-block"
                    alt="imagem do programador"
                  />
                </div>
                
              </div>

              <div>
                <span className="h2">Relatar bugs</span>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    className="form-control my-2"
                    ref={emailInputRef}
                    required
                  />

                  <textarea
                    type="text"
                    name="message"
                    placeholder="Mensagem"
                    rows="3"
                    className="form-control my-2"
                    ref={messageTextRef}
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Enviar
                  </button>
                </form>
              </div>
            </div>

            <div className="col-3" />
          </div>
        </main>
      </div>
    </div>
  );
};
