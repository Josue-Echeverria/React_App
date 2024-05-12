import React from "react";
import { useParams } from 'react-router-dom';
import { Order } from "./Order";
export const Consult = () => {
  const { phone } = useParams();
  const data = { phone };
    
  const request = new Request(`http://localhost:3001/order/${phone}`, {
    method: "GET",

  });

  // let response = fetch(request);
  // console.log(response)
  return <div>
    <Order name={"Josue Echeverria"} total={5000} date="25-08-2020" quantity={2} state="En fabricacion"/>

</div>
};
