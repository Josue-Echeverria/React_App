import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Unit } from "../Order/Unit";
import "./OrderDetail.css"

async function get(dir){
  let response = await fetch(`http://localhost:3001${dir}`);
  let jsonData = await response.json()
  return jsonData
}

let ORIGINAL = {}

export function edit(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  ORIGINAL[parentNode.id] = childNodes[0].value
  childNodes[0].disabled = false
  childNodes[1].style.display = "none"
  childNodes[2].style.display = "flex"
  childNodes[3].style.display = "flex"
}
export function cancelEdit(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  childNodes[0].value = ORIGINAL[parentNode.id]
  
  childNodes[0].disabled = true
  childNodes[1].style.display = "flex"
  childNodes[2].style.display = "none"
  childNodes[3].style.display = "none"
  console.log(ORIGINAL)
}
export function saveEdit(e){
  e.target.parentNode.childNodes[1].style.display = "flex"
  e.target.parentNode.childNodes[2].style.display = "none"
  e.target.parentNode.childNodes[3].style.display = "none"
}

export const OrderDetails = () => {
  const { code } = useParams();
  const [data, setData] = useState(null); // Initialize data state

  const handleChange = (event) => {
    setData({...data, name: event.target.value}); // update state when input changes
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let order = await get(`/order/${code}`);
        order = order[0]

        order["imgDesign"] = (await get(`/image/${order["idImgDesign"]}`))[0]["image"]
        
        order["imgFirstPayment"] = (await get(`/image/${order["idImgFirstPayment"]}`))[0]["image"]

        if(order["imgSecondPayment"] !== undefined)
          order["imgSecondPayment"] = (await get(`/image/${order["imgSecondPayment"]}`))[0]["image"]
        else
          order["ImgSecondPayment"] = ""

        order["units"] = await get(`/unit/${code}`)
        setData(order); // Set the fetched data in state
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
      <div className="data" id="date">
        <label>Fecha de creacion: </label>
        <p className="info">{data.date.substring(0, 10)}</p>
      </div>
      <div className="imgDiv">
        <img src={data.imgDesign} alt="Design"></img>
      </div>
    </div>
    <div className="question">
      <label>Nombre:</label>
      <div className="data" id="name">
        <input value={data.name} onChange={handleChange}  disabled={true} /> 
        <i class="fa-solid fa-pen" onClick={edit}></i>
        <i class="fa-solid fa-check" onClick={saveEdit}></i>
        <i class="fa-solid fa-xmark" onClick={cancelEdit}></i>
      </div>
    </div>
    <div className="question">
      <label>Número:</label>
      <div className="data" id="phone">
        <input value={data.phone} onChange={handleChange} disabled={true}/> 
        <i class="fa-solid fa-pen" onClick={edit}></i>
        <i class="fa-solid fa-check" onClick={saveEdit}></i>
        <i class="fa-solid fa-xmark" onClick={cancelEdit}></i>
      </div>
    </div>
    <div className="question">
      <label>Dirección:</label>
      <div className="data" id="direction">
        <input value={data.direction} onChange={handleChange} disabled={true}/> 
        <i class="fa-solid fa-pen" onClick={edit}></i>
        <i class="fa-solid fa-check" onClick={saveEdit}></i>
        <i class="fa-solid fa-xmark" onClick={cancelEdit}></i>
      </div>
    </div>
    <div className="question" id="quantity">
      <label>Cantidad:</label>
      <input value={data.quantity} disabled={true}/> 
    </div>
    {data.units.map((unit, index) =>(<Unit key={index}
                                            unitNumber={index+1} 
                                            size={unit.size} 
                                            neckType={unit.neckType} 
                                            detail={unit.description}
                                            disabled={true}/>))}

    <div className="question data" id="total">
      <label>Monto pendiente:</label>
      <p> {data.total} </p> 
    </div>
    <div className="question">
      <label>Comprobante de primer pago:</label><br/>
      <div className="imgDiv">
        <img src={data.imgFirstPayment} alt="First Payment"></img>
      </div>
    </div>
    <div className="question">
      <label>Comprobante de segundo pago:</label><br/>
      <div className="">
        <img src={data.imgSecondPayment} alt="Second Payment"></img>
      </div>
    </div>
  </div>)}
</div>
  
};

