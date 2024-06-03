import React, { useEffect } from 'react';
import Popup from 'reactjs-popup';
import "./Client.css"
import { post, del } from '../../endpoints';

/*
* ORIGINAL is an object that stores the original values of the inputs.
* @type {Object}
*/
let ORIGINAL = {}

function loadPredefinedData(props){
    ORIGINAL[props.unitNumber] = {}

    ORIGINAL[props.unitNumber]["name"] = props.name 
    let name = document.querySelector(`#nameInput${props.unitNumber}`)
    name.value = props.name
    
    ORIGINAL[props.unitNumber]["phone"] = props.phone 
    let phone = document.querySelector(`#phoneInput${props.unitNumber}`)
    phone.value = props.phone

    ORIGINAL[props.unitNumber]["direction"] = props.direction 
    let direction = document.querySelector(`#directionInput${props.unitNumber}`)
    direction.value = props.direction
}


export const Client = (props) => {
  useEffect(()=>{
    loadPredefinedData(props)
  })
  
  /**
   * The Update function is triggered when the user wants to update information.
   * It enables the input fields and shows the save and cancel buttons.
   * @param {Event} e - The event object.
   */
  function update(e){
    const parentNode = e.target.parentNode
    const childNodes = parentNode.childNodes

    ORIGINAL[props.unitNumber]["phone"] = document.querySelector(`#phoneInput${props.unitNumber}`).value
    ORIGINAL[props.unitNumber]["name"] = document.querySelector(`#nameInput${props.unitNumber}`).value
    ORIGINAL[props.unitNumber]["direction"] = document.querySelector(`#directionInput${props.unitNumber}`).value

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
    childNodes[0].value = ORIGINAL[props.unitNumber][parentNode.id]


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
    let phone = document.querySelector(`#phoneInput${props.unitNumber}`).value
    let name = document.querySelector(`#nameInput${props.unitNumber}`).value
    let direction = document.querySelector(`#directionInput${props.unitNumber}`).value

    await post(`/update/client/${phone}`, {phone, name, direction})
    alert("Cambios guardados")

    childNodes[0].disabled = true
    childNodes[1].style.display = "flex"
    childNodes[2].style.display = "none"
    childNodes[3].style.display = "none"
  }

  
function deleteClient(){
  del(`/client/${ORIGINAL[props.unitNumber]["phone"]}`)
  window.location.reload()
}

  return (
<div id= "clientDiv">    
  <div className="question">
    <label>Nombre:</label>
    <div className="data" id="name">
      <input  id={`nameInput${props.unitNumber}`} disabled/> 
      <i class="fa-solid fa-pen" onClick={update}></i>
      <i class="fa-solid fa-check" onClick={saveUpdate}></i>
      <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
    </div>
  </div>
  <div className="question">
    <label>Número:</label>
    <div className="data" id="phone">
      <input  id={`phoneInput${props.unitNumber}`} disabled/> 
      <i class="fa-solid fa-pen" onClick={update}></i>
      <i class="fa-solid fa-check" onClick={saveUpdate}></i>
      <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
    </div>
  </div>
  <div className="question">
    <label>Dirección:</label>
    <div className="data" id="direction">
      <input  id={`directionInput${props.unitNumber}`} disabled/> 
      <i class="fa-solid fa-pen" onClick={update}></i>
      <i class="fa-solid fa-check" onClick={saveUpdate}></i>
      <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
    </div>
  </div>
        
    <Popup trigger={<button className="delBtn"><i class="fa-solid fa-trash-can"></i></button>} position={"top center"}>
    {close => (
    <div className="modal">
      <button className="close" onClick={close}>&times;</button>
      <div className="content">
          <label>Realmente desea eliminar al cliente con el numero {props.phone}</label>
          
      </div>
      <div className='confirmationBtns'>
        <button className="confirmBtn" onClick={deleteClient}>Aceptar</button>
        <button className="cancelBtn" onClick={close}>Cancelar</button>
      </div>
    </div>
    )}</Popup>
</div>
  )
};

