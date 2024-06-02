import React, { useEffect, useState } from "react";
import "./OrderListItem.css"
import { post, get, put } from "../../endpoints";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

let code;

async function sendCancelation(){
    var options = document.getElementsByName('option');
    let reason;
    for (var i = 0, length = options.length; i < length; i++) {
        if (options[i].checked) {
            reason = document.querySelector(`label[for="${options[i].value}"]`).textContent;
            break;
        }
    }
    // Change the state
    const state = "Cancelada"
    await put(`/update/${code}/state`, {state})

    // Send the cancelation petition
    let date = new Date();
    await post(`/order/${code}/cancel`, {reason, date})
    
    // Auto accept the petition
    await put(`/order/${code}/cancel/acept`);
    window.location.reload()
}

export const OrderListItem = (props) => {
    code = props.code
    const [gettingCanceled, setGettingCanceled] = useState(null); 
    const [idCancelation, setIdCancelation] = useState(null); 

    function getOrder(){
        window.location.replace(`http://localhost:3002/order/${props.phone}/${props.code}`)
    }

    function rejectCancelation(){
        // Change the state
        const state = "En fabricación"
        put(`/update/${code}/state`, {state})

        put(`/order/cancel/${idCancelation}/reject`);
    }

    function acceptCancelation(){
        // Change the state
        const state = "Cancelada"
        put(`/update/${code}/state`, {state})
    
        put(`/order/cancel/${idCancelation}/accept`);
    }

    async function setSelected(){
        var options = document.getElementsByName('option');
        let reason = (await get(`/order/${props.code}/cancel/reason`))[0];
        setIdCancelation(reason["id"])
        reason = reason["name"]

        for (var i = 0, length = options.length; i < length; i++) {
            // To get the selected option
            if(document.querySelector(`label[for="${options[i].value}"]`).textContent === reason){
                options[i].checked = true
                break;
            }
            options[i].disabled = true
        }            
    }

    useEffect(() => {
        const fetchData = async () => {
            if(props.state === "Cancelando"){
                document.querySelector(`#state${props.code}`).style.backgroundColor = "#FF7070"
                setGettingCanceled(true)
            }else{
                setGettingCanceled(false)
            }
        }
        fetchData();
    },[]);

    return (
<div id= "orderListItem">
    <label id ={`state${props.code}`}>{props.state}</label>
    <div id="order">
        <div id="orderImgList">
            <p className="info" id="date">{props.date}</p> 
            <img src={props.image} alt="Design"></img>
            <p>Telefono: {props.phone}</p>
            <p>Codigo {props.code}</p>
        </div>
            
        <div id="buttons">
            <button onClick={getOrder} className="getBtn"><i class="fa-solid fa-eye"></i></button>
            <Popup onOpen={setSelected} trigger={<button className="delBtn"><i class="fa-solid fa-trash-can"></i></button>} modal nested>
            {close => (
            <div className="modal">
                <button className="close" onClick={close}>&times;</button>
                {gettingCanceled ? (<>
                    <div className="content">
                        <label>Razon: </label>
                        <div className="option">
                            <input type="radio" name="option" value="1"/>
                            <label for="1">Mucho tiempo de espera</label>
                        </div>
                        <div className="option">
                            <input type="radio"  name="option" value="2"/>
                            <label for="2">Encontre una mejor oferta</label>
                        </div>
                        <div className="option">
                            <input type="radio" name="option" value="3"/>
                            <label for="3">Ya no quiero comprar</label>
                        </div>
                    </div>
                    <button className="send getBtn" onClick= {acceptCancelation}>Aceptar</button>
                    <button className="send delBtn" onClick= {rejectCancelation}>Rechazar</button>
                </>):(
                    <>
                    <div className="content">
                    <p>Razon: </p>
                    <div className="option">
                        <input type="radio" name="option" value="1"/>
                        <label for="1">Contenido inapropiado</label>
                    </div>
                    <div className="option">
                        <input type="radio"  name="option" value="2"/>
                        <label for="2">Información confusa</label>
                    </div>
                    <div className="option">
                        <input type="radio" name="option" value="3"/>
                        <label for="3">Falta de información</label>
                    </div>
                    </div>
                    <button className="send" onClick= {sendCancelation}>Enviar</button>
                    </>
                )}
            </div>
            )}</Popup>
        </div>

    </div>
</div>
)};
