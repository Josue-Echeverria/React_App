import React from 'react';
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import "./App.css";
import { ConsultOrder, Home, Order } from "./components/Index";


function App() {

  return (
    <div className="App inter101" >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ConsultOrder" element={<ConsultOrder />} />
        <Route path="/Order" element={<Order />} />
      </Routes>
    </div>
  );
}

export default App;