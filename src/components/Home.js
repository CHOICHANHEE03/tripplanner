import React from 'react';
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import "../css/Home.css";

import spring from '../image/Main_Spring.jpg';
import summer from '../image/Main_Summer.jpg';
import fall from '../image/Main_Fall.jpg';
import winter from '../image/Main_Winter.jpg';

const images = [spring, summer, fall, winter];

const Home = () => {
  const navigate = useNavigate();

  const handleTourismClick = () => {
    navigate('/tourism');
  };

  const handleEventsClick = () => {
    navigate('/events');
  };
  return (
    <div>
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
                <h2>트립 플래너 사이트에 오신 것을 환영합니다.</h2>
                <p>트립 플래너에서 당신에게 맞는 여행지를 추천받고, 특별한 여행을 계획하세요!</p>
              </div>
              <div className="image-container">
                <img src={src} alt={`slide${index + 1}`} className="slide-img" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="info-section">
        <h2>최신 관광지 정보</h2>
        <div className="info-container">
          <div className="info-box"></div>
          <div className="info-box"></div>
          <div className="info-box"></div>
        </div>
        <p className="info-text">더 많은 정보를 보시겠습니까?&nbsp;&nbsp;&nbsp;
          <button className="info-button" onClick={handleTourismClick}>관광지 바로가기</button>
        </p>
      </div>
      <div className="info-section">
        <h2>최신 행사 정보</h2>
        <div className="info-container">
          <div className="info-box"></div>
          <div className="info-box"></div>
          <div className="info-box"></div>
        </div>
        <p className="info-text">더 많은 정보를 보시겠습니까?&nbsp;&nbsp;&nbsp;
          <button className="info-button" onClick={handleEventsClick}>행사 바로가기</button>
        </p>
      </div>
    </div>

  );
};

export default Home;