import React from "react";
import "./Unit.css"

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


   
    let sizeBtn = document.querySelector(`#size${props.size}Unit${props.unitNumber}Btn`)
    if(props.size !== undefined && sizeBtn !== null){
        loadPredefinedData(props)
    }

    return (
<div id="unit"><br/>
    <label>Unidad {props.unitNumber}</label><br/><br/>
    <div className="buttonsDiv">
        <label>Talla: </label>
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
        <label>Tipo de cuello: </label>
        <div className="unitButtons" id={`unit${props.unitNumber}neckTypeButtons`}>
            <button id={`neckTypeRedondoUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonNeckClick}>Redondo</button>
            <button id={`neckTypeVUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonNeckClick}>V</button>
            <button id={`neckTypePoloUnit${props.unitNumber}Btn`} className="unitButton" onClick={handleButtonNeckClick}>Polo</button>
        </div>
    </div>
    <div id="detailDiv">
        <label>Detalle:</label>
        <input type="text" id={`unit${props.unitNumber}Detail`}/>
    </div>
    <p style={{display:"none"}} id={`sizeUnit${props.unitNumber}`}></p>
    <p style={{display:"none"}} id={`neckTypeUnit${props.unitNumber}`}></p>
</div>
);
};
