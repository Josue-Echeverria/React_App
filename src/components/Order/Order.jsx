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
   * This is a eventHandler to add units everytime the user modifies the quantity input for the order
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
  }


  function getUnitsInfo(){
    let quantity = document.querySelector("#quantity").value
    let unitSize
    let unitNeckType
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

      unitsInfo.push({"size":unitSize, "neckType":unitNeckType})
    }
    return unitsInfo
  }

  
  function calculatePrices(){
    const unitsInfo = getUnitsInfo() 

    let price = 0
    console.log(unitsInfo)
    for(let i = 0; i<unitsInfo.length; i++){
      if(unitsInfo[i]["size"] in ADULT_SIZES)
        price+=ADULT_PRICE
      else
        price+=KID_PRICE
    }
    console.log(price)
    return price
  }


  function sendOrder(){  
    let phone = document.querySelector("#phone").value
    let name = document.querySelector("#name").value
    let direction = document.querySelector("#direction").value
    let quantity = document.querySelector("#quantity").value

  }

  return <div id="orderQuestionary">
    <div className="question">
      <label>Diseño: </label><br/>
      <UploadFile/>
    </div>

    <div className="question">
      <label>Nombre: </label>
      <input type="text" id="name" required/>
    </div>

    <div className="question">
      <label>Número de teléfono:</label>
      <input type="number" id="phone" required/>    
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
      <label>Especificaciones por unidad: </label>
      <div id="units"></div>
    </div>
    <button id = "calculatePrice" onClick={calculatePrices}>Calcular precios</button>
{/* 
    
    <div className="question">
      <div className="payment">
          <label>Total a pagar:</label>
          <p id="total"></p> 
      </div>
    </div>
    <div className="question">
      <div className="payment">
        <label>Primer pago:</label>
        <p id="firstHalf"></p> 
      </div> 
      <UploadFile/>
    </div>
    <div className="question">
      <div className="payment">
        <label>Segundo pago:</label>
        <p id="secondHalf"></p>  
      </div>
      <UploadFile/>
  </div> */}
  </div>
};

