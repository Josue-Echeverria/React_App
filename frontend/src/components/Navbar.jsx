import { NavLink } from "react-router-dom";
import "./Navbar.css";
import Popup from "reactjs-popup/dist";
import 'reactjs-popup/dist/index.css';



document.addEventListener("click", function(event) {
  const dropdownContent = document.querySelector(".dropdown-content");
  const dropbtn = document.querySelector(".dropbtn");
  const backbtn = document.querySelector(".backbtn");
  if(event.target === dropbtn){
    if(dropdownContent.style.display === "none")
      dropdownContent.style.display = "flex"
    else
      dropdownContent.style.display = "none"

  }else if(event.target === backbtn){
    window.location.href = backbtn.href
    dropbtn.style.display = "flex"
    backbtn.style.display = "none"
  }else{
    if(dropdownContent.style.display === "flex")
      dropdownContent.style.display = "none"
  }
});

function consult(){
  const phone = document.querySelector("#number");
  if(phone !== null){
    if(phone.value.length === 8)
      window.location.replace(`http://localhost:3000/consult/${phone.value}`)
  }
}

function Navbar(){
  return (
    <nav>
      <div class="dropdown">
        <i class="fas fa-bars dropbtn" ></i>
        <i class="fas fa-arrow-left backbtn" href="/" style={{display:"none"}} ></i>
        <div class="dropdown-content">
          
          <NavLink to="/order">Realizar pedido</NavLink>
          <Popup trigger={<a id="labelLink">Consultar pedido</a>} modal nested>
          {close => (
            <div className="modal simpleModal">
              <label className="modalItem" id="consultNumber">Por favor indique su número de teléfono:</label>
              <input className="modalItem" type="number" id="number"></input>
              <button className="close" onClick={close}>&times;</button>
              <button className="send modalItem" onClick= {consult}>Enviar</button>
            </div>
          )}</Popup>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;