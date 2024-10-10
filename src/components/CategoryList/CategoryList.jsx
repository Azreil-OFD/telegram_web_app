import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CategoryList.css";
import { useTelegram } from "../../hooks/useTelegram";
import {useLocalStorage} from "@uidotdev/usehooks";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const { tg } = useTelegram();
  const [loading , setLoading]= useState(true)
    const [title, setTitle] = useLocalStorage('title', "")

  tg.MainButton.hide();

  useEffect(() => {
      setTitle("Категории")
    setLoading(true)
    fetch(
      "https://azreil-ofj-backend-tg-c56e.twc1.net/v1/categories?populate[products][populate]=images"
    )
      .then((response) => response.json())
      .then((data) => {
        // Фильтруем категории, у которых есть продукты
        const filteredCategories = data.data.filter(
          (category) => category.attributes.products.data.length > 0
        );
        setCategories(filteredCategories);
      })
      .catch((error) => console.error("Error fetching categories:", error)).finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (<h1 className="page-title">Загрузка...</h1>)
  }
  return (
    <>
      {/*<h1 className="page-title">Категории</h1>*/}
      <div className="category-list">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="category-item"
          >
            {category.attributes.title}
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
