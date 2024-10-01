import React from "react";
import "./ProductItem.css";

const ProductItem = ({ product }) => {
  return (
    <div className="product-item">
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Цена: {product.solar}</p>
      {product.images.length > 0 && (
        <img
          src={product.images[0].formats.thumbnail.url}
          alt={product.title}
          className="product-image"
        />
      )}
    </div>
  );
};

export default ProductItem;
