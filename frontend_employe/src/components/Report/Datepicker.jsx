import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Datepicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="App">
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        isClearable
        placeholderText="Select a date"
      />
    </div>
  );
}

