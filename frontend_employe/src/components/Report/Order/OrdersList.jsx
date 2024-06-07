import React, { useState, useEffect } from "react"
import { OrderListItem } from "../../Index"
import { post, get } from "../../../endpoints"
import "./OrdersList.css"

function getReport(){
    window.location.replace("http://localhost:3002/orders/report/download")
}

export const DeliveredList = () => {
    const [Orders, setOrders] = useState(null);

    useEffect(() =>{
        const fetchData = async () =>{
            try {
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                const end = new Date();

                const pending = await (await post("/orders/date_range", {start, end})).json()

                console.log(pending)
                setOrders(pending)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData()
    }, []); 

    return (<>
<nav>
    <a href="/main"><i class="fas fa-arrow-left backbtn"  ></i></a>
</nav>
<div className="srcrollable deliveredList">
    <button onClick={getReport} id="ordersReport"><i class="fa-solid fa-download"></i></button>
    
    <ul>
    {Orders && (<>{Orders.map((order, index) => (
          <OrderListItem key={order.id} 
          phone={order.phone}
          code={order.id} 
          date={order.date} 
          delivered={order.delivered} 
          image={order.image} 
          state={order.state} />
        ))}
    </>)}
    </ul>
</div>
</>)}