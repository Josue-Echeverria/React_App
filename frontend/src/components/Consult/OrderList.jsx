import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { OrderListItem } from "./OrderListItem";
import "./OrderList.css"

export const OrderList = () => {
  const { phone } = useParams();
  const [data, setData] = useState(null); // Initialize data state

  useEffect(() => {
    const dropbtn = document.querySelector(".dropbtn");
    dropbtn.style.display = "none"
    const backbtn = document.querySelector(".backbtn");
    backbtn.style.display = "flex"
    backbtn.href  = "/"

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/orders/${phone}`);
        const jsonData = await response.json();
        setData(jsonData); // Set the fetched data in state
        // If there are orders with that clientes number 
        if(jsonData.length>0)
          // Hide the title indicating that there are no orders
          document.querySelector("#noOrder").style.display = "none";
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function
  }, [phone]); // Dependency array ensures it runs when 'phone' changes

  
  return <div>
    <h1 id="noOrder">No se han realizado ordenes con este número de teléfono</h1>
    {data && (
      <ul>
        {data.map((item) => (
          <OrderListItem key={item.id} 
          phone={phone}
          code={item.id} 
          date={item.date.substring(0, 10)} 
          image={item.image} total={item.total} 
          state={item.name} 
          idImgFirstPayment={item.idImgFirstPayment}
          idImgSecondPayment={item.idImgSecondPayment}/>
        ))}
      </ul>
    )}
  </div>

};
