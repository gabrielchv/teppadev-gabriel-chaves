import React from "react";

function Login() {
  return (
    <div className="LoginPage container">
      <div className="row justify-content-center">
        <div className="loginBox mt-5 d-grid gap-1 col-xs-12 col-sm-5 col-lg-3 text-center align-self-center">
          <input type="text" className="form-control" placeholder="Usuário" />
          <input type="password" className="form-control" placeholder="Senha" />
          <button className="btn btn-primary btn-md btn-block">Entrar</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
