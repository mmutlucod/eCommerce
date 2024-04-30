import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';

const Container = styled.div`
  width: 80%; // Carousel'in genişliğini ayarla
  margin: auto; // Merkeze al
`;

const Image = styled.img`
margin: 0 auto;
  max-width: 200px;
  max-height: 180px; // Sabit yükseklik ayarladım
  
`;

const ImageCarousel = ({ images }) => {
    const settings = {
        dots: true, // Nokta göstergelerini aktif et
        infinite: true, // Sonsuz döngü
        speed: 500, // Geçiş hızı
        slidesToShow: 1, // Bir seferde kaç slayt gösterileceği
        slidesToScroll: 1, // Bir seferde kaç slayt geçileceği
        autoplay: false, // Otomatik oynatma
        autoplaySpeed: 3000, // Otomatik oynatma hızı
        cssEase: "linear", // Animasyon türü
        adaptiveHeight: false, // Slaytların yüksekliğine göre yüksekliği ayarlamayı kapat
    };

    return (
        <Container>
            <Slider {...settings}>
                {images.map((img, index) => (
                    <div key={index}>
                        <Image src={`http://localhost:5000/img/${img}`} alt={`Slide ${index}`} />
                    </div>
                ))}
            </Slider>
        </Container>
    );
};

export default ImageCarousel;
