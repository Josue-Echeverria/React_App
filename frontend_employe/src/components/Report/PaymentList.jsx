import React, { useState, useEffect } from "react"
import { PaymentItem, ReportPDF } from "./../Index"
import { get } from "../../endpoints"
import "./PaymentList.css"
import Popup from "reactjs-popup"
import { Label } from "recharts"

function getReport(){
    window.location.replace("http://localhost:3002/payments/report")
}

export const PaymentList = () => {

    const [Payments, setPayments] = useState(null);

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
    <button onClick={getReport}><i class="fa-solid fa-download"></i></button>
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