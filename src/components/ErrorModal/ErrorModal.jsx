import React from "react";
import "./ErrorModal.css"; // Подключаем CSS стили

const ErrorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p>Товара нет в наличии</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Ок
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
