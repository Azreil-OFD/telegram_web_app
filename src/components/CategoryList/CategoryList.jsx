import React from "react";
import { Link } from "react-router-dom";
import "./CategoryList.css"; // импортируем CSS файл для стилей

const CategoryList = () => {

    const categories = [
        {id: 1 , title: "Мухаморы 1"},
        {id: 2 , title: "Мухаморы 2"},
        {id: 3 , title: "Мухаморы 3"},
        {id: 4 , title: "Мухаморы 4"},
    ]
  return (
    <div className="category-list">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="category-item"
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
