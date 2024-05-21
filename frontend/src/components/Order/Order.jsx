import React from "react";
import { Unit } from "./Unit";
import ReactDOM from "react-dom/client";
import {UploadFile} from "./UploadFile"
import "./Order.css"

const ADULT_SIZES = ["XL","L","M","S"]
const KID_SIZES = ["16","14","12","10","8"]
const ADULT_PRICE = 5000
const KID_PRICE = 4000


export const Order = () => {
  let unitsRoot = ""

  /**
   * This is an eventHandler to add units everytime the user modifies the quantity input for the order
   * 
   * @param {Event} e - The event
   * 
   */
  function addUnits(e){
    if(unitsRoot === "") // To avoid warning for creating a root too many times 
      unitsRoot = ReactDOM.createRoot(document.getElementById("units"))
    let units = []
    // Creates units accordingly to the amount especified in the quantity input
    // And stores them in an array
    for (let number = 1; number <= e.target.value; number++) {
      units.push(<Unit key={number} unitNumber = {number} isConsult={false}/>)
    }
    // Displays the array of units in the div "units"
    unitsRoot.render(
      units
    );
    // Hides the payment inputs
    if(e.target.value > 0){
      document.querySelector("#calculatePrice").style.display = "flex"
      document.querySelector("#totalPaymentDiv").style.display = "none"
      document.querySelector("#firstPaymentDiv").style.display = "none"
      document.querySelector("#secondPaymentDiv").style.display = "none"
      document.querySelector("#sendOrderBtn").style.display = "none"
    }
  }

  /** 
   * @description Collects the information from the page and stores all the units in an array to the return it
   * 
   * @returns All the information(Size, neckType) necesary for each unit specified by the client
   */
  function getUnitsInfo(){
    let quantity = document.querySelector("#quantity").value
    let unitSize
    let unitNeckType
    let unitDetail
    let unitsInfo = []

    // For each unit that the client wants
    // Confirm that the necktype and size have been especified
    // The store the unit
    for(let i = 1; i<= quantity; i++){
      unitSize = document.querySelector(`#sizeUnit${i}`).textContent
      if(unitSize === ""){
        alert(`Por favor especifique la talla de la unidad ${i}`)
        return null
      }
      unitNeckType = document.querySelector(`#neckTypeUnit${i}`).textContent
      if(unitNeckType === ""){
        alert(`Por favor especifique el tipo de cuello de la unidad ${i}`)
        return null
      }
      unitDetail = document.querySelector(`#unit${i}Detail`).value
      // After collecting all the info(Size, neckType, description)
      // The unit is pushed into the array of units
      unitsInfo.push({"size":unitSize, "neckType":unitNeckType, "detail":unitDetail})
    }
    return unitsInfo
  }

  /**
   * @param {Array} unitsInfo All the units information(size, neckType, detail) provided by the client
   * 
   * @returns The cost based on the sizes of the units
   */
  function calculatePrice(unitsInfo = getUnitsInfo()){
    // (Means that some information from the units is missing)
    if(unitsInfo === null)
      return null
    let price = 0
    // For each unit
    for(let i = 0; i<unitsInfo.length; i++){
      // If the unit is adult size 
      // Charge ADULT_PRICE
      if(ADULT_SIZES.includes(unitsInfo[i]["size"]))
        price+=ADULT_PRICE
      // If the unit is kid size 
      // Charge KID_PRICE
      else if(KID_SIZES.includes(unitsInfo[i]["size"]))
        price+=KID_PRICE
      else
        alert(`La talla de la unidad ${i} no es valida`)
    }
    return price
  }

  /**
   * @description Displays in the page the total price and what the client should pay in the first and second payment
   * 
   * @returns null in case the specification of a unit is missing
   */
  function displayPrices(){
    // totalPrice null means that the client haven't especified all the units information
    const totalPrice = calculatePrice()
    // So it can't display the price because it sould be calculated based on the sizes
    if(totalPrice === null)
      return null

    document.querySelector("#total").textContent = `${totalPrice} Colones`
    document.querySelector("#firstHalf").textContent = `${totalPrice/2} Colones`
    document.querySelector("#secondHalf").textContent = `${totalPrice/2} Colones`
    document.querySelector("#totalPaymentDiv").style.display = "flex"
    document.querySelector("#firstPaymentDiv").style.display = "grid"
    document.querySelector("#secondPaymentDiv").style.display = "grid"
    document.querySelector("#sendOrderBtn").style.display = "flex"
    document.querySelector("#calculatePrice").style.display = "none"
  }

  /**
   * @description Checks if all the inputs have been filled to then send the order(all the information) to the backend 
   * 
   * @returns undefined in case an input is empty
   */
  async function sendOrder(){  
    let design = document.querySelector("#designImg")
    // If the client hasn't uploaded the design they want
    if(design === null){
      alert("Por favor especifique el diseño que desea al inicio del cuestionario")
      return;
    }
    design = design.src
    let phone = document.querySelector("#phone").value
    let name = document.querySelector("#name").value
    let direction = document.querySelector("#direction").value
    let quantity = document.querySelector("#quantity").value
    let total = document.querySelector("#total").textContent

    let firstPaymentImg = document.querySelector("#firstPaymentImg")
    // If the client hasn't uploaded the bill of the first payment
    if(firstPaymentImg === null){
      alert("Por favor suba la imagen del comprobante de transeferencia o pago por sinpe del primer pago")
      return;
    }
    firstPaymentImg = firstPaymentImg.src

    let secondPaymentImg = document.querySelector("#secondPaymentImg")
    // If the client uploaded the bill of the second payment
    // Since it is not necesary to pay everything at once, there is no alert
    if(secondPaymentImg !== null){
      secondPaymentImg = secondPaymentImg.src
    }

    let unitsInfo = getUnitsInfo()
    // If the units info is null
    // Means that the client hasn't specified the size or neck type ofa unit
    if(unitsInfo === null)
      return
    
    const data = { name
      , phone
      , direction
      , quantity
      , unitsInfo
      , total
      , design
      , firstPaymentImg
      , secondPaymentImg};
    // Request to the backend sending all the order data as the body
    const request = new Request("http://localhost:3001/order", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    let response = await fetch(request);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Sends the user to another page to show all the orders they had placed with that phone number
    window.location.replace(`http://localhost:3000/consult/${phone}`)
  }

  return <div className="scrollable">
    <div className="question">
      <label>Diseño: </label><br/>
      <UploadFile fileName="designImg" isSecondPayment={false}/>
    </div>

    <div className="question">
      <label>Nombre: </label>
      <input type="text" id="name" required/>
    </div>

    <div className="question">
      <label>Número de teléfono:</label>
      <input type="number" id="phone" required/>    
      <p className="info">Por favor digitar sin espacios ni guiones </p>  
    </div>

    <div className="question">   
      <label>Dirección:</label>
      <input type="text" id="direction" required/>
    </div>

    <div className="question">
      <label>Cantidad:</label>
      <input onChange={addUnits} type="number" id="quantity" max={"20"} min={"1"}required/>
    </div>

    <div className="question">
      <div id="units"></div>
    </div>
    <button id = "calculatePrice" onClick={displayPrices}>Calcular precio</button>

    <div className="question payment" id="totalPaymentDiv">
      <label>Total a pagar:</label>
      <p id="total"></p> 
    </div>
    <div className="question"  id="firstPaymentDiv">
      <div className="payment">
        <label>Primer pago:</label>
        <p id="firstHalf"></p> 
      </div> 
      <UploadFile fileName="firstPaymentImg" isSecondPayment={false}/>
    </div>
    <div className="question" id="secondPaymentDiv">
      <div className="payment">
        <label>Segundo pago:</label>
        <p id="secondHalf"></p>  
      </div>
      <UploadFile fileName="secondPaymentImg" isSecondPayment={false}/>
      <p className="info">No es necesario realizar el segundo pago en este instante </p>  
    </div> 
    <button id = "sendOrderBtn" onClick={sendOrder}>Enviar</button>

  </div>
};

