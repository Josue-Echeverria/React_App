import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar(){

  return (
    <nav>
      <div class="dropdown">
        <i class="fas fa-bars dropbtn"></i>
        
        <div class="dropdown-content">
          <NavLink to="/order">Realizar pedido</NavLink>
          <NavLink to="/consultOrder">Consultar pedido</NavLink>
        </div>
      </div>
      <Link to="/" className="title">
        Website
      </Link>
  
    </nav>
  );
};
export default Navbar;