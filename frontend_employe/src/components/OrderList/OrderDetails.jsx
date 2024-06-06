import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Unit } from "./Unit";
import "./OrderDetail.css"
import { post, get, put } from "../../endpoints";
import Popup from "reactjs-popup";

/**
 * ORIGINAL is an object that stores the original values of the inputs.
 * @type {Object}
 */
let ORIGINAL = {}
const states = [('Entregado'),('En fabricación'),('Listo')]


/**
 * The Update function is triggered when the user wants to update information.
 * It enables the input fields and shows the save and cancel buttons.
 * @param {Event} e - The event object.
 */
function update(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  const statesSelect = document.querySelector("#statesSelect")
  let options = statesSelect.childNodes
  // Sets the state as selected in the frontend
  for(let i = 0; i<options.length; i++){
    if(options[i].selected === true)
      ORIGINAL["state"] = options[i].textContent
  }
  childNodes[1].disabled = false
  childNodes[2].style.display = "none"
  childNodes[3].style.display = "flex"
  childNodes[4].style.display = "flex"
}


/**
 * The cancelUpdate function is triggered when the user cancels the update.
 * It restores the original values and hides the save and cancel buttons.
 * @param {Event} e - The event object.
 */
function cancelUpdate(e){
  const parentNode = e.target.parentNode
  const childNodes = parentNode.childNodes
  const statesSelect = document.querySelector("#statesSelect")
  let options = statesSelect.childNodes
  // Sets the state as selected in the frontend
  for(let i = 0; i<options.length; i++){
    if(options[i].textContent === ORIGINAL["state"])
      options[i].selected = true
  }

  childNodes[1].disabled = true
  childNodes[2].style.display = "flex"
  childNodes[3].style.display = "none"
  childNodes[4].style.display = "none"
}

export const OrderDetails = () => {
  const { code } = useParams();
  const [data, setData] = useState(null); 
  const [firstPaymentRecieved, setfirstPaymentRecieved] = useState(null); 
  const [secondPaymentRecieved, setSecondPaymentRecieved] = useState(null); 
  const [imgSecondPayment, setimgSecondPayment] = useState(null); 
  const handleChange = (event) => {
    setData({...data, name: event.target.value}); // update state when input changes
  };


  function sendFirstPayment(){
    let amount = document.querySelector("#inputFirstPayment").value
    if(amount.length <= 1){
      alert("El monto digitado no es valido")
      return
    }
    amount = parseInt(amount, 10)
    const date = data.date
    const name = data.name
    const idImgPayment = data.idImgFirstPayment
    const isFirstPayment = true
    post("/payment", {date, amount, code, name, idImgPayment, isFirstPayment})
    window.location.reload();
  }

  
  function sendSecondPayment(){
    let amount = document.querySelector("#inputSecondPayment").value
    if(amount.length <= 1){
      alert("El monto digitado no es valido")
      return
    }
    amount = parseInt(amount, 10)
    const date = data.date
    const name = data.name
    const idImgPayment = data.idImgFirstPayment
    const isFirstPayment = false
    post("/payment", {date, amount, code, name, idImgPayment, isFirstPayment})
    window.location.reload();
  }


  /**
   * The saveUpdate function is triggered when the user saves the update.
   * It sends a POST request to update the client information and then disables the input fields and hides the save and cancel buttons.
   * @param {Event} e - The event object.
   */
  async function saveUpdate(e){
    const parentNode = e.target.parentNode
    const childNodes = parentNode.childNodes
    let state;
    // Gets the current state of the order
    const statesSelect = document.querySelector("#statesSelect")
    if(statesSelect !== null){
      let options = statesSelect.childNodes
      // Sets the state as selected in the frontend
      for(let i = 0; i<options.length; i++){
        if(options[i].selected)
          state = options[i].textContent
      }
    }
    const userId = 1 // This is jsut for  testing purposes
    put(`/update/state/${code}`, {state, userId})

    childNodes[1].disabled = true
    childNodes[2].style.display = "flex"
    childNodes[3].style.display = "none"
    childNodes[4].style.display = "none"
  }

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
        }

        const payments = await get(`/payment/${code}`)
        if(payments.length === 0){
          setfirstPaymentRecieved(false)
          setSecondPaymentRecieved(false)
        }else if (payments.length === 1){
          if(payments[0]["isFirstPayment"]){
            setfirstPaymentRecieved(true)
            setSecondPaymentRecieved(false)
            order["firstPaymentRecieved"] = payments[0]["amount"]
            // if(payments[1] !== undefined){
            //   order["secondPaymentRecieved"] = payments[1]["amount"]
            //   setSecondPaymentRecieved(true)
            // }
          }else{
            order["secondPaymentRecieved"] = payments[0]["amount"]
            setSecondPaymentRecieved(true)
            setfirstPaymentRecieved(false)
          }
        }

        // Get all the units that referenced the order code
        order["units"] = await get(`/unit/${code}`)
        // Gets the current state of the order
        const statesSelect = document.querySelector("#statesSelect")
        if(statesSelect !== null){
          let options = statesSelect.childNodes
          // Sets the state as selected in the frontend
          for(let i = 0; i<options.length; i++){
            if(options[i].textContent === order["state"])
              options[i].selected = true
          }
        }

        setData(order); // Set the data to show everything in the frontend

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(); // Call the async function
  }, [code]); 

  
  return <div id="orderConsult"> 
  <nav>
    <a href="/main">
      <i class="fas fa-arrow-left backbtn"  >
      </i>
    </a>
  </nav>
  {data && (
 
  <div className="scrollable">
    <div className="question states">
      <label for="states">Estado:</label>
      <select name="states" id="statesSelect" disabled>
      {states.map((state)=>(
        <option value={state}>{state}</option>
      ))}
      </select>
      <i class="fa-solid fa-pen" onClick={update}></i>
      <i class="fa-solid fa-check" onClick={saveUpdate}></i>
      <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
    </div>
    <div className="question" id="date">
      <div className="data">
        <label>Fecha de creación: </label>
        <p className="info">{data.date.substring(0, 10)}</p>
      </div>
      <div className="imgDiv">
        <img src={data.imgDesign} alt="Design"></img>
      </div>
    </div>
    <div className="question">
      <label>Nombre:</label> 
      <input value={data.name} onChange={handleChange}  disabled={true} id="nameInput"/>
    </div>
    <div className="question">
      <label>Número:</label>
      <input value={data.phone} onChange={handleChange} disabled={true} id="phoneInput"/> 
    </div>
    <div className="question">
      <label>Dirección:</label>
      <input value={data.direction} onChange={handleChange} disabled={true} id="directionInput"/> 
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

    <div className="question payment" id="total">
      <label>Total a pagar:</label>
      <p> ₡{data.total} </p> 
    </div>
    <div className="question">
      <label>Comprobante de primer pago:</label><br/>
      <div className="imgDiv">
        <img src={data.imgFirstPayment} alt="First Payment"></img>
      </div>
    </div>
    <div className="question payment" >
      <label>Monto recibido: </label>
      {firstPaymentRecieved ? (
        <p>₡{data.firstPaymentRecieved}</p>
      ):(<>
        <input className="inputMoney" id="inputFirstPayment"></input> 
        <Popup trigger={<i class="fa-solid fa-check"></i>} position={'top right'}>
          {close => (
          <div className="modal">
            <button className="close" onClick={close}>&times;</button>
            <div className="content">
              <p>¿Desea enviar que el cliente realizó el primer pago exitosamente?</p>
            </div>
            <button onClick= {sendFirstPayment}>Confirmar</button>
          </div>
          )}
        </Popup>
      </>)}
    </div>
    <div className="question" id="SecondPaymentDiv">
    {secondPaymentRecieved ? (<>
      <div className="question" >
        <label>Comprobante de segundo pago:</label><br/>
        <div className="imgDiv" id="imgSecondPaymentDiv">
          <img src={data.imgSecondPayment} alt="Second Payment" id="imgSecondPayment"></img>
        </div>
      </div>
      <div className="question payment" >    
        <label>Monto recibido: </label>
        <p>₡{data.secondPaymentRecieved}</p>
      </div>
    </>):(<>
    {imgSecondPayment ? (<>
      <div className="question" >
        <label>Comprobante de segundo pago:</label><br/>
        <div className="imgDiv" id="imgSecondPaymentDiv">
          <img src={data.imgSecondPayment} alt="Second Payment" id="imgSecondPayment"></img>
        </div>
      </div>
      <div className="question payment" >
        <label>Monto recibido: </label>
        <input className="inputMoney" id="inputSecondPayment"></input> 
        <Popup trigger={<i class="fa-solid fa-check"></i>} position={'top right'}>
          {close => (
          <div className="modal">
            <button className="close" onClick={close}>&times;</button>
            <div className="content">
              <p>¿Desea enviar que el cliente realizó el segundo pago exitosamente?</p>
            </div>
            <button onClick= {sendSecondPayment}>Confirmar</button>
          </div>
          )}
        </Popup>
      </div>
    </>) : (
      firstPaymentRecieved && (<>  
        <div className="question payment">
          <label>Monto pendiente:</label>
          <p>₡{data.total-data.firstPaymentRecieved} </p> 
        </div>
      </>)
    )}
    </>)}
  </div>
</div>)}
</div>};

