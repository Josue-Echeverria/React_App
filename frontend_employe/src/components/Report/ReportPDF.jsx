import DatePicker from "react-datepicker"
import React, {useState, useEffect} from "react";
import {MyPDFDocument} from "./PaymentPDF";
import { post } from "../../endpoints";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import "./ReportPDF.css"

export const ReportPDF = () => {
    const today = new Date(); 
    const past = new Date();
    past.setDate(past.getDate() - 30); 
    
    const [data, setdata] = useState(null);
    const [DateStart, setDateStart] = useState(past);
    const [DateEnd, setDateEnd] = useState(today);

    useEffect(() => {
        const fetchData = async () =>{
            const start = DateStart
            const end = DateEnd
            const payments = (await (await post("/payments", {start, end})).json())
            setdata(payments)
        }
        fetchData()
    }, []); 
    
    return (<>
<nav>
    <a href="/payments">
    <i class="fas fa-arrow-left backbtn"  >
    </i>
    </a>
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

{data && (<>
    <PDFViewer style={{ width: "100%", height:"55vh"}}>
        <MyPDFDocument data={data}/>
    </PDFViewer>
    <PDFDownloadLink document={<MyPDFDocument data={data}/>} fileName="example.pdf">
        
        <button id="downloadBtn">Descargar PDF</button>
    </PDFDownloadLink>
</>)}
</>)}
