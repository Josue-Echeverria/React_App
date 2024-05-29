import React from "react";
import "./OrderListItem.css"
import { del } from "../../endpoints";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export const OrderListItem = (props) => {
    function getOrder(){
        window.location.replace(`http://localhost:3000/consult/${props.phone}/${props.code}`)
    }

    function deleteOrder(){
        window.location.replace(`http://localhost:3000/consult/${props.phone}/${props.code}`)
    }
    
    function sendCancelation(){
        var options = document.getElementsByName('option');
        let selected
        for (var i = 0, length = options.length; i < length; i++) {
            if (options[i].checked) {
            selected = options[i].value
            break;
            }
        }
        del(`/order/${props.code}/${selected}`)
        window.location.replace(`http://localhost:3000/consult/${props.phone}`)
    }

    return (
<div id= "orderListItem">
    <label>{props.state}</label>
    <div id="order">
        <div id="orderImgList">
            <p className="info" id="date">{props.date}</p> 
            <img src={props.image} alt="Design"></img>
            <p>Monto pendiente: ₡{props.total}</p>
            <p>Codigo {props.code}</p>
        </div>
        <div id="buttons">
            <button onClick={getOrder} id="getBtn"><i class="fa-solid fa-eye"></i></button>
            <Popup trigger={<button onClick={deleteOrder} id="delBtn"><i class="fa-solid fa-trash-can"></i></button>} modal nested>
            {close => (
            <div className="modal">
                <button className="close" onClick={close}>&times;</button>
                <div className="content">
                    <p>Porfavor indicanos la razon por la cual desea eliminar su orden: </p>
                    <div className="option">
                        <input type="radio" name="option" value="1"/>
                        <label> Mucho tiempo de espera</label>
                    </div>
                    <div className="option">
                        <input type="radio"  name="option" value="2"/>
                        <label> Encontre una mejor oferta</label>
                    </div>
                    <div className="option">
                        <input type="radio" name="option" value="3"/>
                        <label> Ya no quiero comprar </label>
                    </div>
                </div>
                <button className="send" onClick= {sendCancelation}>Enviar</button>
            </div>
            )}
            </Popup>
        </div>
    </div>
</div>
)};
  