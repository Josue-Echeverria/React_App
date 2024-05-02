import React from "react";
import "./Unit.css"
export const Unit = (props) => {
  return <div id="unit"><br/>
    <label>Unidad {props.unitNumber}</label><br/><br/>
    
    <div className="buttonsDiv">
        <label>Talla:</label>
        <div className="unitButtons">
            <button className="unitButton">XL</button>
            <button className="unitButton">L</button>
            <button className="unitButton">M</button>
            <button className="unitButton">S</button>
            <button className="unitButton">16</button>
            <button className="unitButton">14</button>
            <button className="unitButton">12</button>
            <button className="unitButton">10</button>
            <button className="unitButton">8</button>
        </div>
    </div>
    <div className="buttonsDiv"><br/>
    <label>Tipo de cuello:</label>
    <div className="unitButtons">
        <button className="unitButton">Cuello redondo</button>
        <button className="unitButton">Cuello V</button>
        <button className="unitButton">Cuello Polo</button>
    </div>
    </div>
    <br/>
</div>;
};
