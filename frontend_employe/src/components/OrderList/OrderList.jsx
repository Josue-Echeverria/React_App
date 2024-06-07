import React, { useEffect, useState } from "react";
import { OrderListItem } from "./OrderListItem";
import { get } from "../../endpoints";
import "./OrderList.css"

export const OrderList = () => {
  const [data, setData] = useState(null); // Initialize data state

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await get("/orders_pending")
        const jsonData = await response
        setData(jsonData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function
  }, []); 

  
  return <div>
    {data && (
      <ul>
        {data.map((item) => (
          <OrderListItem key={item.id} 
          phone={item.phone}
          code={item.id} 
          date={item.date.substring(0, 10)} 
          image={item.image} 
          state={item.state} />
        ))}
      </ul>
    )}
  </div>

};
