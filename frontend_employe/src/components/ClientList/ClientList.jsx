import React, { useEffect, useState } from 'react';
import { get } from '../../endpoints';
import { Client } from './Client';


export const ClientList = () => {
  const [data, setData] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      const clients = await get("/clients")
      setData(clients)
    }
    fetchData()
  },[])
  return (
  <div className="ClientList scrollable">
    {data && (
    <div>
      {data.map((client, index) =>(<Client key={index}
                                          unitNumber={index}
                                          name={client.name} 
                                          phone={client.phone} 
                                          direction={client.direction}
                                          />))}
      </div>
    )}
    </div> 
)}
