import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/ImageSlider.css';

const ImageSlider = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "linear",
        appendDots: dots => (
            <div
                style={{
                    position: 'absolute',
                    bottom: '0', // Dots'un altındaki boşluğu kaldırmak için bottom değerini değiştirdik
                    width: '100%',
                }}
            >
                <ul style={{ margin: '0', padding: '0', textAlign: 'center' }}> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <div
                style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: 'white',
                    margin: "0 5px",
                    display: 'inline-block',
                    transition: 'background-color 0.2s'
                }}
            >
            </div>
        )
    };

    return (
        <div style={{
            position: 'relative',
            padding: '0', // Slider altındaki boşluğu kaldırmak için paddingBottom: 0 eklendi
            border: '1px solid #ccc', // Çerçeve eklendi
            borderRadius: '8px', // Köşeleri yuvarlak yapmak için
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Hafif bir gölge eklemek için
            backgroundColor: '#fff', // Çerçeve içerisini beyaz yapmak için
            margin: '20px 20px', // Çerçeve etrafında boşluk bırakmak için
            overflow: 'hidden', // İçeriğin dışına taşmaması için
        }}>
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index} style={{ margin: '0', padding: '0' }}> {/* Div içindeki boşlukları kaldırmak için */}
                        <img src={img} alt={`Slide ${index}`} style={{ width: "100%", height: "auto", display: 'block' }} /> {/* Resmi tam oturtmak için */}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
