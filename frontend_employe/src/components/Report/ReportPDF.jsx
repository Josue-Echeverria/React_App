import DatePicker from "react-datepicker"
import React, {useState, useEffect} from "react";
import {PaymentPDFDocument} from "./Payment/PaymentPDF";
import { post } from "../../endpoints";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import "./ReportPDF.css"
import { OrdersPDFDocument } from "./Order/OrdersPDF";

function formatDate(date){
    let dateObj = new Date(date);
    let month = dateObj.getUTCMonth() + 1; // Months are 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    return `${day}/${month}/${year}`
}

export const ReportPDF = (props) => {
    const today = new Date(); 
    const past = new Date();
    past.setDate(past.getDate() - 30); 
    
    const [orders, setOrders] = useState(null);
    const [payments, setPayments] = useState(null);
    const [DateStart, setDateStart] = useState(past);
    const [DateEnd, setDateEnd] = useState(today);

    useEffect(() => {
        const fetchData = async () =>{
            const start = DateStart
            const end = DateEnd
            if(props.data === "payments"){
                const paymentsInfo = (await (await post("/payments", {start, end})).json())
                setPayments(paymentsInfo)
            }else if (props.data === "orders"){
                const ordersInfo = (await (await post("/orders/date_range", {start, end})).json())
                setOrders(ordersInfo)
            }
        }
        fetchData()
    }, ); 

    const startformated = formatDate(DateStart)
    const endformated = formatDate(DateEnd)
    
    return (<>
<nav>
    {payments && (<a href="/payments"><i class="fas fa-arrow-left backbtn"></i></a>)}
    {orders && (<a href="/orders/report"><i class="fas fa-arrow-left backbtn"></i></a>)}
</nav>
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
<>
    <PDFViewer style={{ width: "100%", height:"55vh"}}>
        {payments && (<PaymentPDFDocument data={payments} start={startformated} end={endformated}/>)}
        {orders && (<OrdersPDFDocument data={orders} start={startformated} end={endformated}/>)}
    </PDFViewer>
    
    {payments && (
        <PDFDownloadLink document={<PaymentPDFDocument data={payments} start={startformated} end={endformated}/>} fileName={`reporte_pagos_${startformated}_${endformated}.pdf`}>
            <button id="downloadBtn">Descargar PDF</button>
        </PDFDownloadLink>
    )}
    {orders && (
        <PDFDownloadLink document={<OrdersPDFDocument data={orders} start={startformated} end={endformated}/>} fileName={`reporte_pedidos_${startformated}_${endformated}.pdf`}>
            <button id="downloadBtn">Descargar PDF</button>
        </PDFDownloadLink>
    )}
    
</>
</>)}
