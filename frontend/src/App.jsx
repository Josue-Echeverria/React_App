import React from 'react';
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import "./App.css";
import { OrderList, Home, Order, OrderDetails } from "./components/Index";


function App() {

  return (
    <div className="App inter101" >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Consult/:phone" element={<OrderList />} />
        <Route path="/Consult/:phone/:code" element={<OrderDetails />} />
        <Route path="/Order" element={<Order />} />
      </Routes>
    </div>
  );
}

export default App;
