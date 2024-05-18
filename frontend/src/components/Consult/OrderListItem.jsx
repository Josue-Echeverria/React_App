import React from "react";
import "./OrderListItem.css"
export const OrderListItem = (props) => {
    function getOrder(){
        window.location.replace(`http://localhost:3000/consult/${props.phone}/${props.code}`)

    }
    return <div id= "orderListItem" onClick={getOrder}>
        <p className="info" id="date">{props.date}</p>
        <div id="order">
        <img src={props.image} alt="Design"></img>
        <div id="info">
            <div className="data" id="total">
                <label>Monto pendiente:</label>
                <p>{props.total}</p>
            </div>
            <div className="data" id="state">
                <label>Estado:</label>
                <p>{props.state}</p>
            </div>
            <div className="data" id="state">
                <label>Codigo:</label>
                <p>{props.code}</p>
            </div>
            
        </div>
        </div>
  </div>
  };
  