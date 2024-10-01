import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; // Импортируем Slider из react-slick
import "./ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Стили для слайдера

const ProductItem = () => {
    const { categoryID, productID } = useParams(); // Получаем categoryID и productID из URL
    const [product, setProduct] = useState(null);

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

    // Настройки для слайдера
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    console.log(product.images)
    return (
        <div className="product-item">
            {product.images.length > 0 && (
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
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Цена: {product.solar}</p>
        </div>
    );
};

export default ProductItem;
