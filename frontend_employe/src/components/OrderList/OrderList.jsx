import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { OrderListItem } from "./OrderListItem";
import { get } from "../../endpoints";
import "./OrderList.css"

export const OrderList = () => {
  const [data, setData] = useState(null); // Initialize data state

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await get("/orders")
        const jsonData = await response
        setData(jsonData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function
  }, []); // Dependency array ensures it runs when 'phone' changes

  
  return <div>
    {data && (
      <ul>
        {data.map((item) => (
          <OrderListItem key={item.id} 
          phone={item.phone}
          code={item.id} 
          date={item.date.substring(0, 10)} 
          image={item.image} 
          state={item.name} />
        ))}
      </ul>
    )}
  </div>

};
