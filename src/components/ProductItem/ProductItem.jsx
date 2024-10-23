import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "./ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTelegram } from "../../hooks/useTelegram";
import Select from "./../Select/Select";
import { useLocalStorage } from "@uidotdev/usehooks";

const BASE_URL = "https://azreil-ofj-backend-tg-c56e.twc1.net";
// TODO: Добавить информацию о наличии товара

const ProductItem = () => {
  const [cart, setCart] = useLocalStorage("cart", []);
  const { categoryID, productID } = useParams();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { tg } = useTelegram();
  const [title, setTitle] = useLocalStorage("title", "");

  const navigate = useNavigate();

  const totalPrice = useMemo(() => {
    return product ? (product.attributes.solar / 50) * weight : 0;
  }, [product, weight]);

  const addToCart = (productToAdd) => {
    console.log(productToAdd)
    const existingProduct = cart.find(
      (item) =>
        item.id === productToAdd.id && item.weight === productToAdd.weight,
    );

    const updatedCart = existingProduct
      ? cart.map((item) =>
          item.id === productToAdd.id && item.weight === productToAdd.weight
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cart, { ...productToAdd, quantity: 1 }];

    setCart(updatedCart);
  };

  const handleAddToCart = async () => {
    console.log(product)
    addToCart({ id: product.id, ...product.attributes, weight });
    setWeight(0);
    setSuccess(true);
    tg.MainButton.hide();
    navigate("/");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/v1/categories?populate[products][populate]=images`,
        );
        const data = await response.json();
        const category = data.data.find(
          (category) => category.id === parseInt(categoryID),
        );

        if (category) {
          const foundProduct = category.attributes.products.data.find(
            (product) => product.id === parseInt(productID),
          );
          setProduct(foundProduct || null);
          setTitle(foundProduct.attributes.title);
          console.log(product)
          if (!foundProduct) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    tg.MainButton.setText("Добавит в корзину!");
    tg.MainButton.onClick(handleAddToCart);
  }, [tg]);

  useEffect(() => {
    if (totalPrice !== 0) tg.MainButton.show();
    else tg.MainButton.hide();
  }, [totalPrice, tg]);

  if (loading) return <h1 className="page-title">Загрузка...</h1>;
  if (!product) return <p>Продукт не найден</p>;

  const onSelect = (_weight) => {
    setSuccess(false);
    setWeight(_weight);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="product-item">
      {product.attributes.images.data.length > 1 ? (
        <Slider {...sliderSettings}>
          {product.attributes.images.data.map((image, index) => (
            <div key={index}>
              <img
                src={image.attributes.url}
                alt={product.attributes.title}
                className="product-image"
              />
            </div>
          ))}
        </Slider>
      ) : (
        product.attributes.images.data.map((image, index) => (
          <div key={index}>
            <img
              src={image.attributes.url}
              alt={product.attributes.title}
              className="product-image"
            />
          </div>
        ))
      )}
      <p>
        <b>Описание: </b> {product.attributes.description}
      </p>
      <p>
        <b>Цена: </b> {product.attributes.solar}₽ / 50 гр
      </p>
      <div className="total">Итоговая стоимость: {Math.trunc(totalPrice)}₽</div>
      <br />
      <p>
        <b>Выберите граммовку</b>
      </p>
      <Select start={50} end={1000} step={50} onSelect={onSelect} />
    </div>
  );
};

export default ProductItem;
