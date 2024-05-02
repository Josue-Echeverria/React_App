import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";


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
    window.location.href = '/'
    dropbtn.style.display = "flex"
    backbtn.style.display = "none"
  }else{
    if(dropdownContent.style.display === "flex")
      dropdownContent.style.display = "none"
  }
});

function Navbar(){
  return (
    <nav>
      <div class="dropdown">
        <i class="fas fa-bars dropbtn" ></i>
        <i class="fas fa-arrow-left backbtn"  style={{display:"none"}} ></i>
        <div class="dropdown-content">
          
          <NavLink to="/order" onClick={() =>{
            const dropbtn = document.querySelector(".dropbtn");
            dropbtn.style.display = "none"
            const backbtn = document.querySelector(".backbtn");
            backbtn.style.display = "flex"
          }}>Realizar pedido</NavLink>
          
          <NavLink to="/consultOrder">Consultar pedido</NavLink>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;