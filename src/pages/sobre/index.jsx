import React, {useEffect, useState, useRef} from "react";
import api from '../../server/api'
import github from '../../server/github'

import NavBar from "../../components/NavBar";

import iconUser from '../../assert/user-icon.png'
import { toast } from "react-toastify";

export default () => {

const [apiGit, setApiGit] = useState({
  avatar_url: iconUser,
  name: 'Name',
  company: 'company',
  location: '...',
  bio: '...'
});

const nameInputRef = useRef()
const emailInputRef = useRef()
const messageTextRef = useRef()

useEffect( () => {

  if (apiGit === null) return

  async function fetch(){
    const response = await github.get(`https://api.github.com/users/alvino`)
    console.log(response.data)
    const {avatar_url, name, location, company, bio} = response.data
    setApiGit({ avatar_url, name, location, company, bio });
  }

  fetch()

},[apiGit])

const handleSubmit = async (event) => {
  event.preventDefault()

  const name = nameInputRef.current.value
  const email = emailInputRef.current.value
  const message = messageTextRef.current.value

  const response = await api.post(`send`, {name, email, message})
  if(response.status > 500) toast.error('Não foi possivel enviar email')
}


  return (
    <div>
      <NavBar />

      <div className="container-fluid">
        <main>
          <div class="row">
            <div class="col-6">
              <img
                src={apiGit.avatar_url}
                width='100px'
                class="rounded mx-auto d-block"
                alt="..."
              />
              <p>{apiGit.name}</p>
              <p>{apiGit.company}</p>
              <p>{apiGit.location}</p>
              <p>{apiGit.bio}</p>
            </div>
            <div class="col-6">
              <div>
                <span className="h2">Relatar bugs</span>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    className="form-control my-2"
                    ref={nameInputRef}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Digite o seu e-mail"
                    className="form-control my-2"
                    ref={emailInputRef}
                    required
                  />

                  <p>Assunto: CucA-aplicativo</p>

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
          </div>
        </main>
      </div>
    </div>
  );
};
