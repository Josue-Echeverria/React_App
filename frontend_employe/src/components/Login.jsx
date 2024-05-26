import React from 'react';
import "./Login.css"
import { post } from "../endpoints"


export const Login = () => {

  const handleLogin = async () => {
    const name = document.querySelector("#user").value
    const password = document.querySelector("#password").value
    const response = await post("/login",{name, password})
    const id = (await response.json())[0]
    if( id !== undefined)
      window.location.replace("http://localhost:3002/main")

  };

  return (
    <div id="login">
      <div className="container">
        <label>Nombre de usuario:</label>
        <input type="text" id="user" />
        <label>Contraseña:</label>
        <input type="password" id='password' />
        <button onClick={handleLogin}>Iniciar sesion</button>
      </div>
    </div>
  );
}
