import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/ImageSlider.css';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';


const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="slick-arrow slick-next0" onClick={onClick}>
            <FaArrowRight />
        </div>
    );
};

// Sol ok bileşeni
const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div className="slick-arrow slick-prev0" onClick={onClick}>
            <FaArrowLeft />
        </div>
    );
};

const ImageSlider = ({ images }) => {
    const settings = {
        dots: false, // Dots'u kaldırmak için false yapıldı
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };

    return (
        <div className="slider-container0" style={{ margin: '20px 40px' }}>
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index} className="slider-image-container0">
                        <img src={img} alt={`Slide ${index}`} className="slider-image0" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
