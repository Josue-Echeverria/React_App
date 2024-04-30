import React from "react";

export const Order = () => {
  return <div>
    <label>Diseño: </label>
    <label>Nombre: </label>
    <input type="text" id="name" required/><br/><br/>
    <label>Número de teléfono:</label>
    <input type="number" id="phone" required/><br/><br/>            
    <label>Dirección:</label>
    <input type="text" id="direction" required/><br/><br/>    
    <label>Cantidad:</label>
    <input type="number" id="quantity" required/><br/><br/> 
    <label>Especificaciones por unidad: </label>
    <div id="units">
    </div>
    <button id = "sendOrder" >Enviar pedido</button>
  </div>
};
