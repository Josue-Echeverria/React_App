import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Unit } from "../Order/Unit";
import { UploadFile } from "../Order/UploadFile";
import "./OrderDetail.css"
import { post, get } from "../../endpoints";

/**
 * ORIGINAL is an object that stores the original values of the inputs.
 * @type {Object}
 */
let ORIGINAL = {}


/**
 * The Update function is triggered when the user wants to update information.
 * It enables the input fields and shows the save and cancel buttons.
 * @param {Event} e - The event object.
 */
function update(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  ORIGINAL["phoneInput"] = document.querySelector("#phoneInput").value
  ORIGINAL["nameInput"] = document.querySelector("#nameInput").value
  ORIGINAL["directionInput"] = document.querySelector("#directionInput").value

  childNodes[0].disabled = false
  childNodes[1].style.display = "none"
  childNodes[2].style.display = "flex"
  childNodes[3].style.display = "flex"
}


/**
 * The cancelUpdate function is triggered when the user cancels the update.
 * It restores the original values and hides the save and cancel buttons.
 * @param {Event} e - The event object.
 */
function cancelUpdate(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  console.log(ORIGINAL)
  childNodes[0].value = ORIGINAL[childNodes[0].id]
  ORIGINAL = {}

  childNodes[0].disabled = true
  childNodes[1].style.display = "flex"
  childNodes[2].style.display = "none"
  childNodes[3].style.display = "none"
}


/**
 * The saveUpdate function is triggered when the user saves the update.
 * It sends a POST request to update the client information and then disables the input fields and hides the save and cancel buttons.
 * @param {Event} e - The event object.
 */
async function saveUpdate(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  let phone = document.querySelector("#phoneInput").value
  let name = document.querySelector("#nameInput").value
  let direction = document.querySelector("#directionInput").value

  await post(`/update/client/${phone}`, {phone, name, direction})
  alert("Cambios guardados")

  childNodes[0].disabled = true
  childNodes[1].style.display = "flex"
  childNodes[2].style.display = "none"
  childNodes[3].style.display = "none"
}

export const OrderDetails = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [orderReady, setOrderReady] = useState(null); 
  const [orderCanceling, setOrderCanceling] = useState(null); 

  const [secondPaymentReceived, setSecondPaymentReceived] = useState(null); 
  const [firstPaymentReceived, setFirstPaymentReceived] = useState(null); 
  const [inputImgSecondPayment, setinputImgSecondPayment] = useState(null); 
  const handleChangeName = (event) => {
    setData({...data, name: event.target.value}); // update state when input changes
  };
  const handleChangePhone = (event) => {
    setData({...data, phone: event.target.value}); // update state when input changes
  };
  const handleChangeDirection = (event) => {
    setData({...data, direction: event.target.value}); // update state when input changes
  };

  useEffect(() => {
    /**
     * @description This function get all the data of the order to then process it to be able to display it 
     */
    const fetchData = async () => {
      try {
        // Gets all the data and stores it to process it
        let order = await get(`/order/${code}`);
        order = order[0]
        // Gets the images (The order just haves the id of the images not the images)
        order["imgDesign"] = (await get(`/image/${order["idImgDesign"]}`))[0]["image"]
        order["imgFirstPayment"] = (await get(`/image/${order["idImgFirstPayment"]}`))[0]["image"]

        // Verifies the payments the client has done
        const payments = (await get(`/payment/${code}`))
        if(payments.length === 0){
          setFirstPaymentReceived(false)
        }else if (payments.length >= 1){
          order["firstPayment"] = payments[0]["amount"]
          setFirstPaymentReceived(true)
          if(order["state"] === "Listo"){
            setOrderReady(true)
            if(order["idImgSecondPayment"] === null){
              setinputImgSecondPayment(true)
            }else{
              setinputImgSecondPayment(false)
              order["imgSecondPayment"] = (await get(`/image/${order["idImgSecondPayment"]}`))[0]["image"]
              if(payments.length === 2){
                setSecondPaymentReceived(true)
              }else{
                setSecondPaymentReceived(false)
              }
            }
          } 
        } 
        if(order["state"] === "Cancelando" || order["state"] === "Cancelada"){
          setOrderCanceling(true);
        }else
          setOrderCanceling(false);
        // Get all the units that referenced the order code
        order["units"] = await get(`/unit/${code}`)
        setData(order); // Set the data to show everything in the frontend

        const dropbtn = document.querySelector(".dropbtn");
        dropbtn.style.display = "none"
        const backbtn = document.querySelector(".backbtn");
        backbtn.href = `/consult/${order["phone"]}`
        backbtn.style.display = "flex"
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(); // Call the async function
  }, [code]); 

  
  return <div className="scrollable" id="orderConsult">
  {data && (
  <div>
    <div className="question" id="date">
      <div className="data" id="date">
        <label>Fecha de creacion: </label>
        <p>{data.date.substring(0, 10)}</p>
      </div>
      <div className="imgDiv">
        <img src={data.imgDesign} alt="Design"></img>
      </div>
    </div>
    <div className="question">
      <label>Nombre:</label>
      <div className="data" id="name">
        <input value={data.name} onChange={handleChangeName}  disabled={true} id="nameInput"/> 
        {orderCanceling ? (<></>):(<i class="fa-solid fa-pen" onClick={update}></i>)}
        <i class="fa-solid fa-check" onClick={saveUpdate}></i>
        <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
      </div>
    </div>
    <div className="question">
      <label>Número:</label>
      <div className="data" id="phone">
        <input value={data.phone} onChange={handleChangePhone} disabled={true} id="phoneInput"/> 
        {orderCanceling ? (<></>):(<i class="fa-solid fa-pen" onClick={update}></i>)}
        <i class="fa-solid fa-check" onClick={saveUpdate}></i>
        <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
      </div>
    </div>
    <div className="question">
      <label>Dirección:</label>
      <div className="data" id="direction">
        <input value={data.direction} onChange={handleChangeDirection} disabled id="directionInput"/> 
        {orderCanceling ? (<></>):(<i class="fa-solid fa-pen" onClick={update}></i>)}
        <i class="fa-solid fa-check" onClick={saveUpdate}></i>
        <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
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
                                            disabled={true}
                                            canceling={orderCanceling }/>))}

    <div className="question data" id="total">
      <label>Total a pagar:</label>
      <p> ₡{data.total} </p> 
    </div>
    <div className="question data" >
      <label>Primer pago:</label>
      {firstPaymentReceived ? 
      (
        <p>₡{data.firstPayment}</p> 
      ) : (
        <p>Esperando confirmación</p>
      )}
    </div>
    <div className="question">
      <label>Comprobante de primer pago:</label><br/>
      <div className="imgDiv">
        <img src={data.imgFirstPayment} alt="First Payment"></img>
      </div>
    </div>

    {orderReady ? (
    <>
      {inputImgSecondPayment ? (
      <>
        <div className="question data payment">
          <label>Monto pendiente:</label>
          <p> ₡{data.total-data.firstPayment} </p> 
        </div>
        <div className="question payment">
          <label>Comprobante de segundo pago:</label><br/>
          <UploadFile isSecondPayment={true} id={data.id} phone={data.phone} idImgSecondPayment = {data.idImgSecondPayment}/>
        </div>
      </>
      ) : (
      <>
        {secondPaymentReceived ? (
        <>
          <div className="question data">
            <label>Segundo pago: </label>
            <p> ₡{data.total-data.firstPayment} </p> 
          </div>
        </>) : (
        <>
          <div className="question data">
            <label>Segundo pago:</label>
            <p>Esperando confirmación</p>
          </div>
        </>)}
        <div className="question">
          <label>Comprobante de segundo pago:</label><br/>
          <div className="imgDiv" id="imgSecondPaymentDiv">
            <img src={data.imgSecondPayment} alt="Second Payment" id="imgSecondPayment"></img>
          </div>
        </div>
      </>)}  
    </>) : (
      <p>Podra subir el comprobante del segundo pago cuando el pedido este listo</p>
    )}
  </div>
  )}
</div>
  
};

