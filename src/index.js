import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

document.addEventListener("click", function(event) {
    const dropdownContent = document.querySelector(".dropdown-content");
    const dropbtn = document.querySelector(".dropbtn");
    if(event.target === dropbtn){
        if(dropdownContent.style.display === "none")
            dropdownContent.style.display = "flex"
        else
            dropdownContent.style.display = "none"
    }else{
        if(dropdownContent.style.display === "flex")
            dropdownContent.style.display = "none"
    }
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );