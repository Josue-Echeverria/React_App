import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Chart = (props) =>{
  if(props.data)
    for(let i = 0; i<props.data.length; i++)
      props.data[i]["date"] = props.data[i]["date"].substring(3,10)

  return (
<ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={props.data}
    margin={{top: 5, right: 30, left: 20, bottom: 5,}}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey={props.XAxis} />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey={props.dataName} fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>
)} 