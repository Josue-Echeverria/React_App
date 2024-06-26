import React from 'react';
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login, Main, OrderDetails, PaymentList, ReportPDF, DeliveredList } from "./components/Index";


function App() {

  return (
    <div className="App inter101" >
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Esto deberia de ser temporal ya que la pagina proncipal no deberia ser accesible */}
        <Route path="/main" element={<Main />} />
        <Route path="/order/:phone/:code" element={<OrderDetails />} />
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/payments/report" element={<ReportPDF data="payments"/>} />
        <Route path="/orders/report" element={<DeliveredList />} />
        <Route path="/orders/report/download" element={<ReportPDF data="orders"/>} />
        
      </Routes>
    </div>
  );
}

export default App;
