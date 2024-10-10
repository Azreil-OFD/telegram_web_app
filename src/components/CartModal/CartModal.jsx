import React from "react";
import "./CartModal.css"; // Подключаем CSS стили

const CartModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p>Вы уверены, что хотите оформить заявку?</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Отмена
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
