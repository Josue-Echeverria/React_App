import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { OrderListItem } from "./OrderListItem";
import "./OrderList.css"

export const OrderList = () => {
  const { phone } = useParams();
  const [data, setData] = useState(null); // Initialize data state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/orders/${phone}`);
        const jsonData = await response.json();
        setData(jsonData); // Set the fetched data in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function
  }, [phone]); // Dependency array ensures it runs when 'phone' changes

  
  return <div>
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
