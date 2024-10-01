import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; // Импортируем Slider из react-slick
import "./ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Стили для слайдера
import { useTelegram } from './../../hooks/useTelegram';
import Select from './../Select/Select';

const ProductItem = () => {
    const { categoryID, productID } = useParams(); // Получаем categoryID и productID из URL
    const [product, setProduct] = useState(null);
    const { tg } = useTelegram()

    tg.MainButton.setText("Оформить заказ")
    tg.MainButton.onClick(() => {
        tg.sendData('hello world')
    })
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
    const onSelect = () => {
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
            <Select start={1} end={5} onSelect={onSelect}></Select>
        </div>
    );
};

export default ProductItem;
