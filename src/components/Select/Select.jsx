import React, { useState } from "react";
import './Select.css'; // Файл с кастомными стилями

const Select = ({ start, end, onSelect }) => {
    const [selection, setSelection] = useState(-1);

    const handleClick = (value) => {
        setSelection(value)
        onSelect(value); // Вызываем переданную функцию
    };

    const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
        <div className="select-container">
            {numbers.map((num) => (
                <button
                    key={num}
                    className={"select-button " + (num === selection ? "selection" : "")}
                    onClick={() => handleClick(num)}
                >
                    {num}
                </button>
            ))}
        </div>
    );
};

export default Select;
