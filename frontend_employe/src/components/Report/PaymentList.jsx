import React, { useState, useEffect } from "react"
import { PaymentItem } from "./../Index"
import { get } from "../../endpoints"
import "./PaymentList.css"
import Popup from "reactjs-popup"
import DatePicker from "react-datepicker"

export const PaymentList = () => {
    const today = new Date(); 
    const past = new Date();
    past.setDate(past.getDate() - 30); 

    const [Payments, setPayments] = useState(null);
    const [DateStart, setDateStart] = useState(past);
    const [DateEnd, setDateEnd] = useState(today);

    useEffect(() =>{
        async function fetchData(){
            setPayments(await get("/payments"))
        }
        fetchData()
    })

    return (<>
<nav>
    <a href="/main">
    <i class="fas fa-arrow-left backbtn"  >
    </i>
    </a>
</nav>
<div className="srcrollable paymentList">
    <Popup trigger={<button><i class="fa-solid fa-download"></i></button>} modal nested>
    {close => (
    <div className="modal">
        <button className="close" onClick={close}>&times;</button>
        <div className="dates">
            <div className="date">
                <label>Inicio:</label>
                <DatePicker
                    selected={DateStart}
                    onChange={date => setDateStart(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select a date"
                />
            </div>
            <div className="date">
                <label>Final:</label>
                <DatePicker
                    selected={DateEnd}
                    onChange={date => setDateEnd(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select a date"
                />
            </div>
        </div>
    </div>
    )}</Popup>
    <ul>
        {Payments && ( Payments.map((payment, index) => (
            <PaymentItem key={index} info={payment}/>
        )))}
    </ul>
</div>
</>)}