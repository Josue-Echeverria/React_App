import React, { useState, useEffect } from "react"
import { OrderListItem } from "../Index"
import { get } from "../../endpoints"
import "./OrdersList.css"

function getReport(){
    window.location.replace("http://localhost:3002/orders/delivered/report")
}

export const DeliveredList = () => {
    const [Orders, setOrders] = useState(null);

    useEffect(() =>{
        const fetchData = async () =>{
            try {
                const orders = await get("/orders/all")
                console.log(orders)
                setOrders(orders)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData()
    }, []); 

    return (<>
<nav>
    <a href="/main">
    <i class="fas fa-arrow-left backbtn"  >
    </i>
    </a>
</nav>
<div className="srcrollable deliveredList">
    <button onClick={getReport}><i class="fa-solid fa-download"></i></button>
    
    <ul>
        {Orders.map((order, index) => (
          <OrderListItem key={order.id} 
          phone={order.phone}
          code={order.id} 
          date={order.date.substring(0, 10)} 
          image={order.image} 
          state={order.state} />
        ))}
    </ul>
</div>
</>)}