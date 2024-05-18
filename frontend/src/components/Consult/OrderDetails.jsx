import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Unit } from "../Order/Unit";
import "./OrderDetail.css"

export const OrderDetails = (props) => {
  const { code } = useParams();
  const [data, setData] = useState(null); // Initialize data state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawOrderData = await fetch(`http://localhost:3001/order/${code}`);
        let orderData = await rawOrderData.json();
        orderData = orderData[0]
        const responseImgDesign = await fetch(`http://localhost:3001/image/${orderData["idImgDesign"]}`);
        const imgDesign = await responseImgDesign.json();
        orderData["imgDesign"] = imgDesign[0]["image"]
        
        const rawImgFirstPayment = await fetch(`http://localhost:3001/image/${orderData["idImgFirstPayment"]}`);
        const imgFirstPayment = await rawImgFirstPayment.json();
        orderData["imgFirstPayment"] = imgFirstPayment[0]["image"]

        if(orderData["imgSecondPayment"] !== undefined){
          const rawImgSecondPayment = await fetch(`http://localhost:3001/image/${orderData["idImgSecondPayment"]}`);
          const imgSecondPayment = await rawImgSecondPayment.json();
          orderData["ImgSecondPayment"] = imgSecondPayment[0]["image"]
        }else{
          orderData["ImgSecondPayment"] = ""
        }
        const rawUnits = await fetch(`http://localhost:3001/unit/${code}`);
        const units = await rawUnits.json();
        orderData["units"] = units

        setData(orderData); // Set the fetched data in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function
  }, [code]); 

  
  return <div className="scrollable">
    {data && (
        <div>
        <div className="question" id="date">
          <p className="info">{data.date.substring(0, 10)}</p>
          <img src={data.imgDesign}></img>
        </div>
        <div className="question" id="name">
            <label>Nombre:</label>
            <input className="disabled" value={data.name}  /> 
        </div>
        <div className="question" id="phone">
            <label>Número:</label>
            <input className="disabled" value={data.phone} /> 
        </div>
        <div className="question" id="direction">
            <label>Dirección:</label>
            <input className="disabled" value={data.direction} /> 
        </div>
        <div className="question" id="quantity">
            <label>Cantidad:</label>
            <input className="disabled" value={data.quantity} /> 
        </div>
        <div className="question data" id="total">
            <label>Monto pendiente:</label>
            <p> {data.total} </p> 
        </div>
        <div className="question" id="quantity">
          <label>Comprobante de primer pago:</label>
          <div className="imgDiv">
            <img src={data.imgFirstPayment}></img>
          </div>
        </div>
        <div className="question" id="quantity">
          <label>Comprobante de segundo pago:</label>
          <div className="">
            <img src={data.imgSecondPayment}></img>
          </div>
        </div>
        {data.units.map((unit, index) =>(<Unit key={index}/>))}

        </div>
      
    )}
  </div>
  
};

