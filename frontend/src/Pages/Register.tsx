import React from "react";
import Navbar from "./../Components/Navbar";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const btnRef = React.useRef<HTMLButtonElement>(null);
  const loginStatus = React.useRef<HTMLParagraphElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  let navigate = useNavigate();

  function setValue(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name == "username") setUsername(event.target.value);
    if (event.target.name == "password") setPassword(event.target.value);
    if (event.target.name == "confirmPassword") setConfirmPassword(event.target.value);
  }

  React.useEffect(() => {
    // Habilitar ou desabilitar botão
    if (username != "" && password != "" && confirmPassword != "" && password == confirmPassword) btnRef.current?.classList.remove("disabled");
    else btnRef.current?.classList.add("disabled");
  }, [username, password, confirmPassword]);

  React.useEffect(() => {
    // Permitir a confirmação da senha
    if (confirmPassword != password) {
      confirmPasswordRef.current?.classList.add("is-invalid");
    } else {
      confirmPasswordRef.current?.classList.remove("is-invalid");
    }
  }, [password, confirmPassword]);

  React.useEffect(() => {
    // Mudar o site para login
    if (redirect) return navigate("/entrar");
  }, [redirect]);

  async function createUser() {
    const response = await fetch("/api/registeruser", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setRedirect(data.status);
    if (!data.status) loginStatus?.current?.classList.remove("invisible");
    else loginStatus?.current?.classList.add("invisible");
  }

  return (
    <div>
      <Navbar></Navbar>

      <div className="container">
        <div className="row justify-content-center">
          <div className="loginBox mt-5 d-grid gap-1 col-xs-12 col-sm-6 col-lg-3 text-center">
            <input name="username" onChange={setValue} type="text" className="form-control" placeholder="Usuário" />
            <input name="password" onChange={setValue} type="password" className="form-control" placeholder="Senha" />
            <input ref={confirmPasswordRef} name="confirmPassword" onChange={setValue} type="password" className="form-control" placeholder="Digite a senha novamente" aria-describedby="checarSenha" />
            <div className="invalid-feedback" id="checarSenha">
              As senhas não correspondem
            </div>
            <button onClick={createUser} ref={btnRef} className="btn btn-primary btn-md btn-block">
              Cadastrar
            </button>
            <Link to="/entrar">Entrar</Link>
            <p ref={loginStatus} className="invisible text-danger">
              Este usuário já existe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
