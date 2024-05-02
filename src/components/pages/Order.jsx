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
    </div>

    <div className="question">
      <label>Nombre: </label>
      <input type="text" id="name" required/>
    </div>

    <div className="question">
      <label>Número de teléfono:</label>
      <input type="number" id="phone" required/>    
    </div>

    <div className="question">   
      <label>Dirección:</label>
      <input type="text" id="direction" required/>
    </div>

    <div className="question">
      <label>Cantidad:</label>
      <input type="number" id="quantity" max={"20"} min={"1"}required/>
    </div>

    <div className="question">
      <label>Especificaciones por unidad: </label>
      <div id="units">
      <Unit unitNumber = "1"/>
      </div>
    </div>

    <div className="question">
      <div className="payment">
          <label>Total a pagar:</label>
          <p id="total"></p> 
      </div>
    </div>
    <div className="question">
      <div className="payment">
        <label>Primer pago:</label>
        <p id="firstHalf"></p> 
      </div> 
      <UploadFile/>
    </div>
    <div className="question">
      <div className="payment">
        <label>Segundo pago:</label>
        <p id="secondHalf"></p>  
      </div>
      <UploadFile/>
  </div>
    
    <button id = "sendOrder" >Enviar</button>
  </div>
};
