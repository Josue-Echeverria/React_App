import React from "react";
import "./Unit.css"

export const Unit = (props) => {

    function handleButtonSizeClick(e){
        const buttonsDiv = document.querySelector(`#unit${props.unitNumber}sizeButtons`).getElementsByTagName('button')
        const buttonsDivLength = buttonsDiv.length
        const actualSize = document.querySelector(`#unit${props.unitNumber}Size`)
        for(let i = 0; i<buttonsDivLength;i++)
            buttonsDiv[i].style.backgroundColor = "#B3B3B3"
        
        e.target.style.backgroundColor = "#B8F67B"
        actualSize.textContent = e.target.textContent
    }

    function handleButtonNeckClick(e){
        const buttonsDiv = document.querySelector(`#unit${props.unitNumber}neckTypeButtons`).getElementsByTagName('button')
        const buttonsDivLength = buttonsDiv.length
        const actualNeckType = document.querySelector(`#unit${props.unitNumber}NeckType`)
        for(let i = 0; i<buttonsDivLength;i++)
            buttonsDiv[i].style.backgroundColor = "#B3B3B3"
        
        e.target.style.backgroundColor = "#B8F67B"
        actualNeckType.textContent = e.target.textContent
    }
    

    return <div id="unit"><br/>
    <label>Unidad {props.unitNumber}</label><br/><br/>
    <div className="buttonsDiv">
        <label>Talla:</label>
        <div className="unitButtons" id={`unit${props.unitNumber}sizeButtons`}>
            <button className="unitButton" onClick={handleButtonSizeClick}>XL</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>L</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>M</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>S</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>16</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>14</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>12</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>10</button>
            <button className="unitButton" onClick={handleButtonSizeClick}>8</button>
        </div>
    </div>
    <div className="buttonsDiv"><br/>
    <label>Tipo de cuello:</label>
    <div className="unitButtons" id={`unit${props.unitNumber}neckTypeButtons`}>
        <button className="unitButton" onClick={handleButtonNeckClick}>Cuello redondo</button>
        <button className="unitButton" onClick={handleButtonNeckClick}>Cuello V</button>
        <button className="unitButton" onClick={handleButtonNeckClick}>Cuello Polo</button>
    </div>
    </div>
    <div id="detailDiv">
        <label>Detalle:</label>
        <input type="text" id="detail" required/>
    </div>
    <p style={{display:"none"}} id={`unit${props.unitNumber}Size`}></p>
    <p style={{display:"none"}} id={`unit${props.unitNumber}NeckType`}></p>
</div>;
};
