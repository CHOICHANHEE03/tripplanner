import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import '../css/ImagesSlider.css';

import spring from '../image/Main_Spring.jpg';
import summer from '../image/Main_Summer.jpg';
import fall from '../image/Main_Fall.jpg';
import winter from '../image/Main_Winter.jpg';

const images = [spring, summer, fall, winter];

const ImageSlider = () => {
  return (
    <div className="image-slider">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000 }}
        loop={true}
        className="custom-swiper"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="custom-slide">
            <div className="text-container">
              <h2>트립 플래너 사이트에 오신걸 환영합니다.</h2>
              <p>트립플래너에서 당신에게 맞는 여행지를 추천받고, 특별한 여행을 계획하세요!</p>
            </div>
            <div className="image-container">
              <img src={src} alt={`slide${index + 1}`} className="slide-img" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
