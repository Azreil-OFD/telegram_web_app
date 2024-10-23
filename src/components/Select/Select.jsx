import React, { useState } from "react";
import "./Select.css"; // Файл с кастомными стилями

const Select = ({ start, end, step = 1, onSelect }) => {
  const [selection, setSelection] = useState(start);

  const handleChange = (event) => {
    const value = Number(event.target.value);
    setSelection(value);
    onSelect(value);
  };

  return (
    <div className="select-container">
      <div className="range-value">{selection} гр.</div>
      <input
        type="range"
        min={start}
        max={end}
        step={step}
        value={selection}
        onChange={handleChange}
        className="select-range"
      />
    </div>
  );
};

export default Select;
