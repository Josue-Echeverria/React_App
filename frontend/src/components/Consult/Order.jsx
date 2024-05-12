import React from "react";
import "./Order.css"

export const Order = (props) => {
    
    return <div id="order">
    <img ></img>
    <div id="info">
        
    <div className="data" id="name">
        <label>Nombre: </label>
        <p>{props.name}</p>
    </div>
    <div className="data"  id="date">
        <label>Fecha: </label>
        <p>{props.date}</p>
    </div>
    <div className="data" id="quantity">
        <label>Cantidad: </label>
        <p>{props.quantity}</p>
    </div>
    <div className="data" id="total">
        <label>Total: </label>
        <p>{props.total}</p>
    </div>
    <div className="data" id="state">
        <label>Estado: </label>
        <p>{props.state}</p>
    </div>
    </div>
    
  </div>
  };
  