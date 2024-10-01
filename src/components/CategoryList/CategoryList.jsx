import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CategoryList.css";
import { useTelegram } from "../../hooks/useTelegram";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const { tg } = useTelegram()
  tg.MainButton.hide()
  useEffect(() => {
    fetch("https://committed-victory-e015be0776.strapiapp.com/api/categories?populate[products][populate]=images")
      .then((response) => response.json())
      .then((data) => {
        // Фильтруем категории, у которых есть продукты
        const filteredCategories = data.data.filter(
          (category) => category.products.length > 0
        );
        setCategories(filteredCategories);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
   <>
    <h1 className="page-title">Категории</h1>
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
    </>
  );
};

export default CategoryList;
