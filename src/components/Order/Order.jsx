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
  // const [data, setData] = React.useState(null);
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
      units.push(<Unit key={number} unitNumber = {number}/>)
    }
    // Displays the array of units in the div "units"
    unitsRoot.render(
      units
    );
    if(e.target.value > 0){
      document.querySelector("#calculatePrice").style.display = "flex"
      document.querySelector("#totalPaymentDiv").style.display = "none"
      document.querySelector("#firstPaymentDiv").style.display = "none"
      document.querySelector("#secondPaymentDiv").style.display = "none"
      document.querySelector("#sendOrderBtn").style.display = "none"
    }
  }


  function getUnitsInfo(){
    let quantity = document.querySelector("#quantity").value
    let unitSize
    let unitNeckType
    let unitDetail
    let unitsInfo = []

    // Confirm that all the units have the necktype and size especified
    for(let i = 1; i<= quantity; i++){
      unitSize = document.querySelector(`#unit${i}Size`).textContent
      if(unitSize === ""){
        alert(`Por favor especifique la talla de la unidad ${i}`)
        return null
      }
      unitNeckType = document.querySelector(`#unit${i}NeckType`).textContent
      if(unitNeckType === ""){
        alert(`Por favor especifique el tipo de cuello de la unidad ${i}`)
        return null
      }
      unitDetail = document.querySelector(`#unit${i}Detail`).textContent
      unitsInfo.push({"size":unitSize, "neckType":unitNeckType, "unitDetail":unitDetail})
    }
    return unitsInfo
  }

  
  function calculatePrice(){
    const unitsInfo = getUnitsInfo() 
    if(unitsInfo === null)
      return null
    let price = 0
    for(let i = 0; i<unitsInfo.length; i++){
      if(ADULT_SIZES.includes(unitsInfo[i]["size"]))
        price+=ADULT_PRICE
      else if(KID_SIZES.includes(unitsInfo[i]["size"]))
        price+=KID_PRICE
      else
        alert(`La talla de la unidad ${i} no es valida`)
    }
    return price
  }

  function displayPrices(){
    const totalPrice = calculatePrice()
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


  async function sendOrder(){  
    let design = document.querySelector("#designImg")
    if(design === null){
      alert("Por favor especifique el diseño que desea al inicio del cuestionario")
      return;
    }
    let phone = document.querySelector("#phone").value
    let name = document.querySelector("#name").value
    let direction = document.querySelector("#direction").value
    let quantity = document.querySelector("#quantity").value

    let firstPaymentImg = document.querySelector("#firstPaymentImg")
    if(firstPaymentImg === null){
      alert("Por favor suba la imagen del comprobante de transeferencia o pago por sinpe del primer pago")
      return;
    }

    let secondPaymentImg = document.querySelector("#secondPaymentImg")
    let unitsInfo = getUnitsInfo()
    if(unitsInfo === null)
      return null
    
    // let response = await fetch("/api");//Se sacan los datos del  archivo articulo 
    // alert(response)
    // console.log(response)

    console.log(name)
    console.log(direction)
    console.log(quantity)
    console.log(phone)
  }

  return <div id="orderQuestionary">
    <div className="question">
      <label>Diseño: </label><br/>
      <UploadFile fileName="designImg"/>
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
      <UploadFile fileName="firstPaymentImg"/>
    </div>
    <div className="question" id="secondPaymentDiv">
      <div className="payment">
        <label>Segundo pago:</label>
        <p id="secondHalf"></p>  
      </div>
      <UploadFile fileName="secondPaymentImg"/>
      <p className="info">No es necesario realizar el segundo pago en este instante </p>  
    </div> 
    <button id = "sendOrderBtn" onClick={sendOrder}>Enviar</button>

  </div>
};

