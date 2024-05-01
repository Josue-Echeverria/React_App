import React , { PropTypes, Component } from "react";
import { Unit } from "./Unit";
import {UploadFile} from "./UploadFile"
import "./Order.css"

function sendOrder(){
  var phone = document.getElementById("phone").value
  let name = document.getElementById("name").value
  var direction = document.getElementById("direction").value
  var quantity = document.getElementById("quantity").value
}



export const Order = () => {
  return <div id="orderQuestionary">
    <div className="question">
      <label>Diseño: </label><br/>
      <UploadFile/>
      <br/>
    </div>

    <div className="question">
      <label>Nombre: </label>
      <input type="text" id="name" required/><br/>
    </div>

    <div className="question">
      <label>Número de teléfono:</label>
      <input type="number" id="phone" required/><br/>     
    </div>

    <div className="question">      
      <label>Dirección:</label>
      <input type="text" id="direction" required/><br/>
    </div>

    <div className="question">
      <label>Cantidad:</label>
      <input type="number" id="quantity" required/><br/><br/> 
    </div>

    <div className="question">
      <label>Especificaciones por unidad: </label>
      <div id="units">
      <Unit unitNumber = "1"/>
      </div>
    </div>

    <div className="question">
      <label>Total a pagar:</label>
      <input type="number" id="total" required/><br/><br/> 
      <label>Primer pago:</label>
      <input type="number" id="first_half" required/><br/><br/> 
      <label>Primer pago:</label>
      <input type="number" id="first_half" required/><br/><br/> 
    </div>
    
    <button id = "sendOrder" >Enviar</button>
  </div>
};
