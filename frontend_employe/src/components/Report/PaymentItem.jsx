import React, { useState } from "react"
import "./PaymentItem.css"
import Popup from "reactjs-popup"
import { del } from "../../endpoints"

let ORIGINAL = {}

export const PaymentItem = (props) => {
    const [data, setData] = useState(props.info);
    // setData(props.info.amount)
    console.log(props.info)
    console.log(data)
    const handleChange = (event) => {
        setData({...data.amount, amount: event.target.value}); // update state when input changes
    };

    function getOrder(){
        window.location.replace(`http://localhost:3002/order/${props.info.phone}/${props.info.idOrder}`)
    }

    function confirmDelete(){
        del(`/payment/${props.info.id}`)
        window.location.reload()
    }

    function update(e){
        const parentNode = e.target.parentNode
        const childNodes = parentNode.childNodes

        childNodes[0].disabled = false
        childNodes[1].style.display = "none"

        childNodes[2].childNodes[0].style.display = "grid"
        childNodes[2].childNodes[1].style.display = "grid"
    }

    function cancelUpdate(e){
        const parentNode = e.target.parentNode.parentNode
        const childNodes = parentNode.childNodes

        childNodes[0].disabled = true
        childNodes[1].style.display = "inline-block"
        childNodes[2].childNodes[0].style.display = "none"
        childNodes[2].childNodes[1].style.display = "none"
    }

    function sendUpdate(e){
        const parentNode = e.target.parentNode.parentNode
        const childNodes = parentNode.childNodes

        childNodes[0].disabled = true
        childNodes[1].style.display = "inline-block"
        childNodes[2].childNodes[0].style.display = "none"
        childNodes[2].childNodes[1].style.display = "none"
    }

    return (<>
<div className="paymentItem">
    <Popup trigger={<button on><i class="fa-solid fa-trash-can"></i></button>} position={"left"}>
    {close => (
    <div className="modal">
        <button className="close" onClick={close}>&times;</button>
        <div>
            <label>Realmente desea eliminar el pago de la orden {props.info.idOrder}</label>
            <button onClick={confirmDelete}>Confirmar</button>
        </div>
    </div>
    )}</Popup>
    <label onClick={getOrder}>{props.info.idOrder}</label>
    <label onClick={getOrder}>{props.info.phone}</label>
    <div id="amountDiv">
        {data && (<input onChange={handleChange}  id="amountInput" value={`${data.amount}`} disabled></input>)}
        
        <i onClick={update} class="fa-solid fa-pen"></i>
        <div id="checkxmarkDiv">
            <i onClick={sendUpdate} class="fa-solid fa-check"></i>
            <i onClick={cancelUpdate} class="fa-solid fa-xmark"></i>
        </div>
    </div>
</div>
</>)}
