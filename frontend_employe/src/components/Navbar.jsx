import { OrderList, ClientList, Report } from "./Index";
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
  const [showReport, setShowReport] = useState(false);

  function getOrders(){
    setShowOrders(true);
    setShowClients(false)
    setShowReport(false)
  }
  
  function getClients(){
    setShowOrders(false);
    setShowClients(true)
    setShowReport(false)
  }

  function getReport(){
    setShowOrders(false);
    setShowClients(false)
    setShowReport(true)
  }

  return (
  <div>
    <nav>
        <i class="fa-solid fa-list" onClick={getOrders}></i>
        <i class="fa-solid fa-users" onClick={getClients}></i>
        <i class="fa-solid fa-clock-rotate-left" onClick={getReport}></i>
    </nav>
    {showOrders && <OrderList />}
    {showClients && <ClientList />}
    {showReport && <Report />}
  </div>
  );
};
export default Navbar;