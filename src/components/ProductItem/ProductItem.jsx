import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTelegram } from "../../hooks/useTelegram";
import Select from "../Select/Select";
import { useLocalStorage } from "@uidotdev/usehooks";
import Button from "../Button/Button";

const ProductItem = () => {
  const [cart, setCart] = useLocalStorage("cart", []);
  const { categoryID, productID } = useParams();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(null);
  const { tg } = useTelegram();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const totalPrice = useMemo(() => {
    return product ? (product.attributes.solar / 50) * weight : 0;
  }, [product, weight]);

  const handleAddToCart = () => {
    const newProduct = { id: product.id, ...product.attributes, weight };
    addToCart(newProduct);
    resetForm();
    navigate("/");
  };

  const resetForm = () => {
    setWeight(0);
    setSuccess(true);
    tg.MainButton.hide();
  };

  const addToCart = (newProduct) => {
    const updatedCart = cart.map(item =>
        item.id === newProduct.id && item.weight === newProduct.weight
            ? { ...item, quantity: item.quantity + 1 }
            : item
    );
    const isProductInCart = updatedCart.some(
        item => item.id === newProduct.id && item.weight === newProduct.weight
    );

    setCart(isProductInCart ? updatedCart : [...cart, { ...newProduct, quantity: 1 }]);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
            `https://azreil-ofj-backend-tg-c56e.twc1.net/v1/categories?populate[products][populate]=images`
        );
        const data = await response.json();
        const category = data.data.find(category => category.id === parseInt(categoryID));
        if (category) {
          const product = category.attributes.products.data.find(
              product => product.id === parseInt(productID)
          );
          setProduct(product || null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    tg.MainButton.setText('Оформить заявку!');
    tg.MainButton.onClick(handleAddToCart);

  }, [categoryID, productID]);

  useEffect(() => {
    if (totalPrice > 0) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [totalPrice, tg]);

  const onSelect = selectedWeight => {
    setSuccess(false);
    setWeight(selectedWeight);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const renderImages = () =>
      product.attributes.images.data.map((image, index) => (
          <div key={index}>
            <img
                src={image.attributes.url}
                alt={product.attributes.title}
                className="product-image"
            />
          </div>
      ));

  if (loading) return <h1 className="page-title">Загрузка...</h1>;
  if (!product) return <p>Продукт не найден</p>;

  return (
      <div className="product-item">
        {product.attributes.images.data.length > 1 ? (
            <Slider {...sliderSettings}>{renderImages()}</Slider>
        ) : (
            renderImages()
        )}

        <p><b>Наименование: </b>{product.attributes.title}</p>
        <p><b>Описание: </b>{product.attributes.description}</p>
        <p><b>Цена: </b>{product.attributes.solar}₽ / 50 гр</p>

        <div className="total">Итоговая стоимость: {totalPrice}₽</div>

        <p><b>Выберите граммовку</b></p>
        <Select start={50} end={1000} step={50} onSelect={onSelect} />
        <div
            style={{ position: "fixed", bottom: "10px", left: "10px", right: "10px" }}
        >
          {totalPrice !== 0 && (
              <Button
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "black solid 1px",
                  }}
                  onClick={handleAddToCart}
              >
                Добавить в корзину
              </Button>
          )}
        </div>

      </div>
  );
};

export default ProductItem;
