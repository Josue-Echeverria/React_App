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
export function update(e){
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
export function cancelUpdate(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  childNodes[0].value = ORIGINAL[parentNode.id]
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
export async function saveUpdate(e){
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
  const [data, setData] = useState(null); // Initialize data state
  const [imgSecondPayment, setimgSecondPayment] = useState(null); 
  const [inputImgSecondPayment, setinputImgSecondPayment] = useState(null); 
  const handleChange = (event) => {
    setData({...data, name: event.target.value}); // update state when input changes
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

        // If the image of the second payment has been uploaded
        if(order["idImgSecondPayment"] !== null){
          // Show the image
          setimgSecondPayment(true)
          order["imgSecondPayment"] = (await get(`/image/${order["idImgSecondPayment"]}`))[0]["image"]
        }else{
          setimgSecondPayment(false)
          if(order["State"] === "Listo")
            setinputImgSecondPayment(true)
          else
            setinputImgSecondPayment(false)
        }
        
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
        <input value={data.name} onChange={handleChange}  disabled={true} id="nameInput"/> 
        <i class="fa-solid fa-pen" onClick={update}></i>
        <i class="fa-solid fa-check" onClick={saveUpdate}></i>
        <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
      </div>
    </div>
    <div className="question">
      <label>Número:</label>
      <div className="data" id="phone">
        <input value={data.phone} onChange={handleChange} disabled={true} id="phoneInput"/> 
        <i class="fa-solid fa-pen" onClick={update}></i>
        <i class="fa-solid fa-check" onClick={saveUpdate}></i>
        <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
      </div>
    </div>
    <div className="question">
      <label>Dirección:</label>
      <div className="data" id="direction">
        <input value={data.direction} onChange={handleChange} disabled={true} id="directionInput"/> 
        <i class="fa-solid fa-pen" onClick={update}></i>
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
                                            disabled={true}/>))}

    <div className="question data" id="total">
      <label>Total a pagar:</label>
      <p> {data.total} </p> 
    </div>
    <div className="question data" >
      <label>Primer pago:</label>
      <p> {data.total/2} </p> 
    </div>
    <div className="question">
      <label>Comprobante de primer pago:</label><br/>
      <div className="imgDiv">
        <img src={data.imgFirstPayment} alt="First Payment"></img>
      </div>
    </div>
    <div className="question data">
      <label>Segundo pago:</label>
      <p> {data.total/2} </p> 
    </div>
    <div className="question" id="SecondPaymentDiv">
      {imgSecondPayment ? (<><label>Comprobante de segundo pago:</label><br/>
      <div>
        <div className="imgDiv" id="imgSecondPaymentDiv">
          <img src={data.imgSecondPayment} alt="Second Payment" id="imgSecondPayment"></img>
        </div>
      </div></>) : (<>
        {inputImgSecondPayment ? 
        (<>
          <UploadFile isSecondPayment={true} id={data.id} phone={data.phone} idImgSecondPayment = {data.idImgSecondPayment}/>
        </>):(<>
          <p>Podra subir el comprobante del segundo pago cuando el pedido este listo</p>
        </>)}
      </>)}
    </div>
  </div>)}
</div>
  
};

