import { OrderList, ClientList, Stadistics } from "./Index";
import "./Navbar.css";
import React, { useState } from 'react';
import 'reactjs-popup/dist/index.css';

document.addEventListener("click", function(event) {
  const icons = document.getElementsByClassName("fa-solid")
  for(let i = 0; i < icons.length; i++){
    if(icons[i] === event.target)
      icons[i].style.borderBottom = "solid white 2vw"
    else
      icons[i].style.borderBottom = "none"
  }
});


function Navbar(){
  const [showOrders, setShowOrders] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [showStadistics, setShowStadistics] = useState(false);

  function getOrders(){
    setShowOrders(true);
    setShowClients(false)
    setShowStadistics(false)
  }
  
  function getClients(){
    setShowOrders(false);
    setShowClients(true)
    setShowStadistics(false)
  }

  function getStadistics(){
    setShowOrders(false);
    setShowClients(false)
    setShowStadistics(true)
  }

  return (
  <div>
    <nav>
        <i class="fa-solid fa-list" onClick={getOrders}></i>
        <i class="fa-solid fa-users" onClick={getClients}></i>
        <i class="fa-solid fa-clock-rotate-left" onClick={getStadistics}></i>
    </nav>
    {showOrders && <OrderList />}
    {showClients && <ClientList />}
    {showStadistics && <Stadistics />}
  </div>
  );
};
export default Navbar;