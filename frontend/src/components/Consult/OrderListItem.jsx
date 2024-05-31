import React, {useState, useEffect} from "react";
import "./OrderListItem.css"
import { del, get } from "../../endpoints";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export const OrderListItem = (props) => {
    const [firstPaymentRecieved, setfirstPaymentRecieved] = useState(null); 
    const [secondPaymentRecieved, setsecondPaymentRecieved] = useState(null); 
    const [payment, setPayment] = useState(null); 

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
    useEffect(() => {
        const fetchData = async () => {
            let payments = await get(`/payment/${props.code}`)
            
            if(payments.length === 0){
                setfirstPaymentRecieved(false)
                setsecondPaymentRecieved(false)
            }
            else if(payments.length === 1){
                setfirstPaymentRecieved(true)
                setsecondPaymentRecieved(false)
            } else if (payments.length === 2){
                setfirstPaymentRecieved(false)
                setsecondPaymentRecieved(true)
            }
            await setPayment(payments);
        }
        fetchData();
    }, []); 

    return (
<div id= "orderListItem">
    <label>{props.state}</label>
    <div id="order">
        <div id="orderImgList">
            <p className="info" id="date">{props.date}</p> 
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
  