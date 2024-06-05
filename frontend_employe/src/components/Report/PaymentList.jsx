import React, { useState, useEffect } from "react"
import { PaymentItem } from "./../Index"
import { get } from "../../endpoints"
import "./PaymentList.css"
import Popup from "reactjs-popup"
import DatePicker from "react-datepicker"
import { Label } from "recharts"

export const PaymentList = () => {
    const today = new Date(); 
    const past = new Date();
    past.setDate(past.getDate() - 30); 

    const [Payments, setPayments] = useState(null);
    const [DateStart, setDateStart] = useState(past);
    const [DateEnd, setDateEnd] = useState(today);

    useEffect(() =>{
        const fetchData = async () =>{
            try {
                const payments = await get("/payments")
                setPayments(payments)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData()
    }, []); 

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
    <div className="columnName">
        <label></label>
        <label>Código</label>
        <label>Teléfono</label>
        <label>Monto</label>
    </div>
    <ul>
        {Payments && ( Payments.map((payment, index) => (
            <PaymentItem key={index} info={payment}/>
        )))}
    </ul>
</div>
</>)}