import React, {useState, useEffect} from "react";
import "./OrderListItem.css"
import { post, put, get } from "../../endpoints";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export const OrderListItem = (props) => {
    const [firstPaymentRecieved, setfirstPaymentRecieved] = useState(null); 
    const [secondPaymentRecieved, setsecondPaymentRecieved] = useState(null); 
    const [payment, setPayment] = useState(null); 

    /**
     * 
     */
    function getOrder(){
        window.location.replace(`http://localhost:3000/consult/${props.phone}/${props.code}`)
    }
    
    /**
     * @description ClickHandler when the user confirms that they want to cancel the order
     * 
     * @returns Undefined : In case the client didnt select an option
     */
    function sendCancelation(){
        var options = document.getElementsByName('option');
        let reason;
        // We iterate through the options
        for (var i = 0, length = options.length; i < length; i++) {
            if (options[i].checked) {
                // To get the selected option
                reason = document.querySelector(`label[for="${options[i].value}"]`).textContent;
                break;
            }
        }
        if(reason === undefined){
            alert("Por favor seleccione una razon")
            return
        }
        // Change the state 
        const state = "Cancelando"
        const userId = 1;
        put(`/update/state/${props.code}`, {state, userId})

        // Send the cancelation petition
        let date = new Date();
        post(`/order/${props.code}/cancel`, {reason, date})
        window.location.reload()
    }

    useEffect(() => {
        const fetchData = async () => {
            let payments = await get(`/payment/${props.code}`)
            
            if(payments.length === 0){
                setfirstPaymentRecieved(false)
                setsecondPaymentRecieved(false)
            } else if(payments.length === 1){
                setfirstPaymentRecieved(true)
                setsecondPaymentRecieved(false)
            } else if (payments.length === 2){
                setfirstPaymentRecieved(false)
                setsecondPaymentRecieved(true)
            }
            await setPayment(payments);
        }
        fetchData();
        if(props.state === "Cancelando"){
            document.querySelector(`#state${props.code}`).style.backgroundColor = "#FF7070"
            document.querySelector(`#delBtn${props.code}`).disabled = true
        }else if(props.state === "Cancelada"){
            document.querySelector(`#state${props.code}`).style.background = "#0f172a"
            document.querySelector(`#state${props.code}`).style.color = "#ffffff"
            document.querySelector(`#delBtn${props.code}`).disabled = true
        }

    }, []); 

    return (
<div id= "orderListItem">
    <label id={`state${props.code}`}>{props.state}</label>
    <div id="order">
        <div id="orderImgList">
            <p id="date">{props.date}</p> 
            <img src={props.image} alt="Design"></img>
            {secondPaymentRecieved ? (
                <p>Pagado</p>
                ) : (<>
                {firstPaymentRecieved ? 
                (<p>Monto pendiente: ₡{props.total-payment[0]["amount"]}</p>
                ):(
                <p>Monto pendiente: Esperando confirmación</p>
                )}
            </>)}
            <p>Codigo {props.code}</p>
        </div>
        <div id="buttons">
            <button onClick={getOrder} id="getBtn"><i class="fa-solid fa-eye"></i></button>
            <Popup trigger={<button className="delBtn" id={`delBtn${props.code}`}><i class="fa-solid fa-trash-can"></i></button>} modal nested>
            {close => (
            <div className="modal">
                <button className="close" onClick={close}>&times;</button>
                <div className="content">
                    <p>Por favor indicanos la razon por la cual desea eliminar su orden: </p>
                    <div className="option">
                        <input type="radio" name="option" value="1"/>
                        <label for="1">Mucho tiempo de espera</label>
                    </div>
                    <div className="option">
                        <input type="radio"  name="option" value="2"/>
                        <label for="2">Encontré una mejor oferta</label>
                    </div>
                    <div className="option">
                        <input type="radio" name="option" value="3"/>
                        <label for="3">Ya no quiero comprar</label>
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
  