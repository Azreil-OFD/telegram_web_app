import React, { useState } from "react";
import './Select.css'; // Файл с кастомными стилями

const Select = ({ start, end, step = 1, onSelect }) => {
    const [selection, setSelection] = useState(-1);

    const handleClick = (value) => {
        setSelection(value);
        onSelect(value); // Вызываем переданную функцию
    };

    const numbers = Array.from({ length: Math.floor((end - start) / step) + 1 }, (_, i) => start + i * step);

    return (
        <div className="select-container">
            {numbers.map((num) => (
                <button
                    key={num}
                    className={"select-button " + (num === selection ? "selection" : "")}
                    onClick={() => handleClick(num)}
                >
                    {num} гр.
                </button>
            ))}
        </div>
    );
};

export default Select;
