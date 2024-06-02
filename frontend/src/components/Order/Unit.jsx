import React from "react";
import "./Unit.css"
import { post } from "../../endpoints";

/**
 * ORIGINAL is an object that stores the original values of the inputs.
 * @type {Object}
 */
let ORIGINAL = {}



function disableButtons(div){
    let buttons = div.getElementsByTagName('button')
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function enableButtons(div){
    let buttons = div.getElementsByTagName('button')
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}

function loadPredefinedData(props){
    ORIGINAL[props.unitNumber] = {}

    ORIGINAL[props.unitNumber]["size"] = props.size 
    let sizeBtn = document.querySelector(`#size${props.size}Unit${props.unitNumber}Btn`)
    sizeBtn.style.backgroundColor = "#B8F67B"
    document.querySelector(`#sizeUnit${props.unitNumber}`).textContent = props.size
    
    ORIGINAL[props.unitNumber]["neckType"] = props.neckType 
    let neckType = document.querySelector(`#neckType${props.neckType}Unit${props.unitNumber}Btn`)
    neckType.style.backgroundColor = "#B8F67B"
    document.querySelector(`#neckTypeUnit${props.unitNumber}`).textContent = props.neckType 

    ORIGINAL[props.unitNumber]["detail"] = props.detail 
    let detail = document.querySelector(`#unit${props.unitNumber}Detail`)
    detail.value = props.detail
    
    let sizeButtons = document.querySelector(`#unit${props.unitNumber}sizeButtons`)
    let neckTypeButtons = document.querySelector(`#unit${props.unitNumber}neckTypeButtons`)

    disableButtons(sizeButtons);
    disableButtons(neckTypeButtons);
    detail.disabled = true
}
    
export const Unit = (props) => {

    /**
     * @param {Event} e  event click on the element
     * 
     * @description This function changes the color of the button to green and the other to grey
     */
    function handleButtonSizeClick(e){
        const buttonsDiv = document.querySelector(`#unit${props.unitNumber}sizeButtons`).getElementsByTagName('button')
        const buttonsDivLength = buttonsDiv.length
        const actualSize = document.querySelector(`#sizeUnit${props.unitNumber}`)
        for(let i = 0; i<buttonsDivLength;i++)
            buttonsDiv[i].style.backgroundColor = "#B3B3B3"
        
        e.target.style.backgroundColor = "#B8F67B"
        //Stores wich size was selected
        actualSize.textContent = e.target.textContent
    }


    /**
     * @param {Event} e  event click on the element
     * 
     * @description This function changes the color of the button green and the other to grey
     */
    function handleButtonNeckClick(e){
        const buttonsDiv = document.querySelector(`#unit${props.unitNumber}neckTypeButtons`).getElementsByTagName('button')
        const buttonsDivLength = buttonsDiv.length
        const actualNeckType = document.querySelector(`#neckTypeUnit${props.unitNumber}`)
        for(let i = 0; i<buttonsDivLength;i++)
            buttonsDiv[i].style.backgroundColor = "#B3B3B3"
        
        e.target.style.backgroundColor = "#B8F67B"
        // Stores which necktype as selected
        actualNeckType.textContent = e.target.textContent
    }


    async function saveUpdate(e){
        const parentNode = e.target.parentNode
        const childNodes = parentNode.childNodes
        const parentDivButtons = e.target.parentNode.parentNode
        const buttonsDiv = parentDivButtons.childNodes[parentDivButtons.childNodes.length-1]
        const description = document.querySelector(`#unit${props.unitNumber}Detail`).value
        const size = document.querySelector(`#sizeUnit${props.unitNumber}`).textContent
        const neckType = document.querySelector(`#neckTypeUnit${props.unitNumber}`).textContent
        disableButtons(buttonsDiv)

        await post(`/update/unit/${props.unitNumber}`, {size, description, neckType})
        alert("Cambios guardados")
        childNodes[0].disabled = true
        childNodes[1].style.display = "flex"
        childNodes[2].style.display = "none"
        childNodes[3].style.display = "none"
    }


    /**
     * 
     * @param {*} e 
     */
    function cancelUpdate(e){
        const parentNode = e.target.parentNode
        const childNodes = parentNode.childNodes
        const parentDivButtons = e.target.parentNode.parentNode
        const buttonsDiv = parentDivButtons.childNodes[parentDivButtons.childNodes.length-1]
        const buttons = buttonsDiv.getElementsByTagName('button')
        let div 
        if(buttons.length >= 9){
            div = "size"
        }else{
            div = "neckType"
        }
        for(let i = 0; i<buttons.length;i++){
            buttons[i].style.backgroundColor = "#B3B3B3"
            if(buttons[i].id === `${div}${ORIGINAL[props.unitNumber][div]}Unit${props.unitNumber}Btn`)
                buttons[i].style.backgroundColor = "#B8F67B"
        }
        disableButtons(buttonsDiv)
        childNodes[1].style.display = "flex"
        childNodes[2].style.display = "none"
        childNodes[3].style.display = "none"
        const actualSize = document.querySelector(`#${div}Unit${props.unitNumber}`)
        actualSize.textContent = ORIGINAL[props.unitNumber][div]
    }


    function cancelDescriptionUpdate(e){
        const parentNode = e.target.parentNode
        const childNodes = parentNode.childNodes
        childNodes[0].value = ORIGINAL[props.unitNumber]["detail"]
        childNodes[0].disabled = true
        childNodes[1].style.display = "flex"
        childNodes[2].style.display = "none"
        childNodes[3].style.display = "none"
    }


    function update(e){
        const parentNode = e.target.parentNode
        const childNodes = parentNode.childNodes
        // console.log(childNodes)
        if(childNodes[0].id === `unit${props.unitNumber}Detail`){
            childNodes[0].disabled = false
        }else{
            const parentDivButtons = e.target.parentNode.parentNode
            const buttonsDiv = parentDivButtons.childNodes[parentDivButtons.childNodes.length-1]
            enableButtons(buttonsDiv)
        }
        childNodes[1].style.display = "none"
        childNodes[2].style.display = "flex"
        childNodes[3].style.display = "flex"
    }


    let sizeBtn = document.querySelector(`#size${props.size}Unit${props.unitNumber}Btn`)
    if(props.size !== undefined && sizeBtn !== null){
        loadPredefinedData(props)
    }

    return <div id="unit"><br/>
    <label>Unidad {props.unitNumber}</label><br/><br/>
    <div className="buttonsDiv">
        <div className="buttonsDivIcons">
            <label>Talla: </label>
            {props.canceling ? (<></>):(<i class="fa-solid fa-pen" onClick={update}></i>)}
            <i class="fa-solid fa-check" onClick={saveUpdate}></i>
            <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
        </div>
        <div className="unitButtons" id={`unit${props.unitNumber}sizeButtons`}>
            <button id={`sizeXLUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>XL</button>
            <button id={`sizeLUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>L</button>
            <button id={`sizeMUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>M</button>
            <button id={`sizeSUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>S</button>
            <button id={`size16Unit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>16</button>
            <button id={`size14Unit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>14</button>
            <button id={`size12Unit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>12</button>
            <button id={`size10Unit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>10</button>
            <button id={`size8Unit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonSizeClick}>8</button>
        </div>

    </div>
    <div className="buttonsDiv"><br/>
        <div className="buttonsDivIcons">
            <label>Tipo de cuello: </label>
            {props.canceling ? (<></>):(<i class="fa-solid fa-pen" onClick={update}></i>)}
            <i class="fa-solid fa-check" onClick={saveUpdate}></i>
            <i class="fa-solid fa-xmark" onClick={cancelUpdate}></i>
        </div>
        <div className="unitButtons" id={`unit${props.unitNumber}neckTypeButtons`}>
            <button id={`neckTypeRedondoUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonNeckClick}>Redondo</button>
            <button id={`neckTypeVUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonNeckClick}>V</button>
            <button id={`neckTypePoloUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonNeckClick}>Polo</button>
        </div>
    </div>
    <div id="detailDiv">
        <label>Detalle:</label>
        <div className="data">
            <input type="text" id={`unit${props.unitNumber}Detail`}/>
            {props.canceling ? (<></>):(<i class="fa-solid fa-pen" onClick={update}></i>)}
            <i class="fa-solid fa-check" onClick={saveUpdate}></i>
            <i class="fa-solid fa-xmark" onClick={cancelDescriptionUpdate}></i>
        </div>
    </div>
    <p style={{display:"none"}} id={`sizeUnit${props.unitNumber}`}></p>
    <p style={{display:"none"}} id={`neckTypeUnit${props.unitNumber}`}></p>
</div>;
};
