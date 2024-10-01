import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; // Импортируем Slider из react-slick
import "./ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Стили для слайдера
import { useTelegram } from './../../hooks/useTelegram';
import Select from './../Select/Select';
import { useLocalStorage } from "@uidotdev/usehooks";

const ProductItem = () => {
    const [cart, setCart] = useLocalStorage('cart', [])
    const { categoryID, productID } = useParams(); // Получаем categoryID и productID из URL
    const [product, setProduct] = useState(null);
    const [weight, setWeight] = useState(null);
    const { tg } = useTelegram()
    useEffect(() => {
        tg.MainButton.setText("Добавить в корзину");
    
        const handleAddToCart = () => {
            addToCart({ ...product, weight });
            tg.MainButton.setText("Перейти к корзине");
    
            // Очищаем предыдущий обработчик и добавляем новый для перехода в корзину
            tg.MainButton.onClick(() => {
                navigate(`/cart`);
            });
        };
    
        tg.MainButton.onClick(handleAddToCart);
    
        // Очищаем обработчики при размонтировании
        return () => {
            tg.MainButton.offClick(handleAddToCart);
        };
    }, []);
    // Function to add a product to the cart
    const addToCart = (product) => {
        // Check if product is already in the cart
        const existingProduct = cart.find((item) => item.id === product.id);
        if (existingProduct) {
            // If it's already in the cart, increase the quantity
            const updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updatedCart);
        } else {
            // If it's not in the cart, add it with quantity 1
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    useEffect(() => {
        // Загружаем данные категорий с продуктами
        fetch(`https://committed-victory-e015be0776.strapiapp.com/api/categories?populate[products][populate]=images`)
            .then((response) => response.json())
            .then((data) => {
                const category = data.data.find(category => category.id === parseInt(categoryID));
                if (category) {
                    const foundProduct = category.products.find(product => product.id === parseInt(productID));
                    setProduct(foundProduct);
                }
            })
            .catch((error) => console.error("Error fetching product:", error));
    }, [categoryID, productID]);

    if (!product) {
        return <p>Продукт не найден</p>;
    }
    const onSelect = (_weight) => {
        setWeight(_weight);
        tg.MainButton.show()
    }
    // Настройки для слайдера
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="product-item">
            {product.images.length > 1 && (
                <Slider {...sliderSettings}>
                    {product.images.map((image, index) => (
                        <div key={index}>
                            <img
                                src={image.url}
                                alt={product.title}
                                className="product-image"
                            />
                        </div>
                    ))}
                </Slider>
            )}
            {product.images.length === 1 && (
                product.images.map((image, index) => (
                    <div key={index}>
                        <img
                            src={image.url}
                            alt={product.title}
                            className="product-image"
                        />
                    </div>
                ))
            )}

            <p><b>Наименование: </b>  {product.title}</p>
            <p><b>Описание: </b> {product.description}</p>
            <p><b>Цена: </b> {product.solar}₽</p>
            <p><b>Выберите грамовку</b></p>
            <Select start={100} end={1000} step={100} onSelect={onSelect}></Select>
        </div>
    );
};

export default ProductItem;
