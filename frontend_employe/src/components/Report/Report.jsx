import React, { useEffect, useState} from 'react';
import "./Report.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart } from '../Index';
import { post } from '../../endpoints';

function getPayments(){
  window.location.replace(`http://localhost:3002/payments`)
}

function getOrders(){
  window.location.replace(`http://localhost:3002/orders/delivered`)
}

export const Report = () => {
  const today = new Date(); 
  const past = new Date();
  past.setDate(past.getDate() - 30); 

  const [DateStartChart0, setDateStartChart0] = useState(past);
  const [DateEndChart0, setDateEndChart0] = useState(today);

  const [DateStartChart1, setDateStartChart1] = useState(past);
  const [DateEndChart1, setDateEndChart1] = useState(today);

  const [profits, setProfits] = useState();
  const [ordersRecieved, setOrdersRecieved] = useState();

  useEffect(() => {
    async function fetchData(){
      let start = DateStartChart0
      let end = DateEndChart0
      let orders = await (await post("/orders/count", {start, end})).json()
      setOrdersRecieved(orders)

      start = DateStartChart1
      end = DateEndChart1
      let payments = await (await post("/payments/sum", {start, end})).json()
      setProfits(payments)
    }
    fetchData()
  },[])
  return ( 
<div className='scrollable reports'>
  <div className='report'>
    <h2>Ordenes recibidas</h2>
    <Chart data={ordersRecieved} XAxis="date" dataName="Cantidad" />
    <div className="dates">
      <div className="date">
        <label>Inicio:</label>
        <DatePicker
          selected={DateStartChart0}
          onChange={date => setDateStartChart0(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select a date"
        />
      </div>
      <div className="date">
        <label>Final:</label>
        <DatePicker
            selected={DateEndChart0}
            onChange={date => setDateEndChart0(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
          />
      </div>
    </div>
    <button onClick={getOrders}>Ver ordenes</button>
  </div>
  <div className='report'>
    <h2>Ganacias</h2>
    <Chart data={profits} XAxis="date" dataName="Ganancias" />
    <div className="dates">
      <div className="date">
        <label>Inicio:</label>
          <DatePicker
            selected={DateStartChart1}
            onChange={date => setDateStartChart1(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
          />
      </div>
      <div className="date">
        <label>Final:</label>
        <DatePicker
            selected={DateEndChart1}
            onChange={date => setDateEndChart1(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select a date"
          />
      </div>
    </div>
    <button onClick={getPayments}>Ver pagos</button>
  </div>
</div>
)}
