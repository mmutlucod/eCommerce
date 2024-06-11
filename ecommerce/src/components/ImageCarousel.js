import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  margin: auto;
`;

const Image = styled.img`
  margin: 0 auto;
  max-width: 200px;
  max-height: 140px;
  padding: 15px;
`;

const ImageCarousel = ({ images }) => {
    const defaultImage = 'empty.jpg'; // Varsayılan resim

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,
        cssEase: "linear",
        adaptiveHeight: false,
    };

    return (
        <Container>
            <Slider {...settings}>
                {images && images.length > 0 ? (
                    images.map((img, index) => (
                        <div key={index}>
                            <Image src={`http://localhost:5000/public/img/${img || defaultImage}`} alt={`Slide ${index}`} />
                        </div>
                    ))
                ) : (
                    <div>
                        <Image src={`http://localhost:5000/public/img/${defaultImage}`} alt="Default Slide" />
                    </div>
                )}
            </Slider>
        </Container>
    );
};

export default ImageCarousel;
