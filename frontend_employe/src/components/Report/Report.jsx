import React from 'react';
import "./Report.css"
import { Chart, Datepicker } from '../Index';

export const Report = () => {
  return ( 
<div className='scrollable'>
  <div className='report'>
    <label>Ordenes listas (GRAFICA)</label>
    <button>Obtener reporte</button>
  </div>
  <div className='report'>
    <label>Ganacias (GRAFICA)</label>
    <Datepicker/>
    <Chart/>
    <button>Obtener reporte</button>
  </div>
</div>
)}
