import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "../css/Home.css";

import spring from "../image/Main_Spring.jpg";
import summer from "../image/Main_Summer.jpg";
import fall from "../image/Main_Fall.jpg";
import winter from "../image/Main_Winter.jpg";

const images = [spring, summer, fall, winter];

const Home = () => {
  const navigate = useNavigate();
  const [tourismData, setTourismData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loadingTourism, setLoadingTourism] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const fetchTourismData = useCallback(async () => {
    setLoadingTourism(true);
    try {
      const response = await fetch("http://localhost:8080/api/tourism?page=1&pageSize=9");
      const result = await response.json();

      if (result && Array.isArray(result.content)) {
        const shuffled = [...result.content].sort(() => 0.5 - Math.random()).slice(0, 3);
        setTourismData(shuffled);
      }
    } catch (error) {
      console.error("Failed to fetch tourism data:", error);
    } finally {
      setLoadingTourism(false);
    }
  }, []);

  const fetchEventData = useCallback(async () => {
    setLoadingEvent(true);
    try {
      const response = await fetch("http://localhost:8080/api/event?page=1&pageSize=9");
      const result = await response.json();

      if (result && Array.isArray(result.content)) {
        const shuffled = [...result.content].sort(() => 0.5 - Math.random()).slice(0, 3);
        setEventData(shuffled);
      }
    } catch (error) {
      console.error("Failed to fetch event data:", error);
    } finally {
      setLoadingEvent(false);
    }
  }, []);

  useEffect(() => {
    fetchTourismData();
    fetchEventData();
  }, [fetchTourismData, fetchEventData]);

  return (
    <div>
      {/* 이미지 슬라이더 */}
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

      {/* 관광지 정보 섹션 */}
      <div className="info-section">
        <h2>관광지 정보</h2>
        <div className="info-container">
          {loadingTourism ? (
            <p>관광지 정보를 불러오는 중입니다...</p>
          ) : tourismData.length > 0 ? (
            tourismData.map((tourism) => (
              <div key={tourism.id} className="info-box">
                <img src={tourism.firstimage} alt={tourism.title} className="info-image" />
                <h3>{tourism.title}</h3>
                <p className="truncated-text">{tourism.overview}</p>
                <button
                  className="info-button"
                  onClick={() => navigate(`/tourism/${tourism.id}`)}
                >
                  자세히 보기
                </button>
              </div>
            ))
          ) : (
            <p>관광지 정보가 없습니다.</p>
          )}
        </div>
        <p className="info-text">
          더 많은 정보를 보시겠습니까?&nbsp;&nbsp;&nbsp;
          <button className="info-button" onClick={() => navigate("/tourism")}>
            관광지 바로가기
          </button>
        </p>
      </div>

      {/* 행사 정보 섹션 */}
      <div className="info-section">
        <h2>행사 정보</h2>
        <div className="info-container">
          {loadingEvent ? (
            <p>행사 정보를 불러오는 중입니다...</p>
          ) : eventData.length > 0 ? (
            eventData.map((event) => {
              const currentDate = new Date();
              const rawStartDate = event.eventStartDate;
              const formattedStartDate = `${rawStartDate.slice(0, 4)}-${rawStartDate.slice(4, 6)}-${rawStartDate.slice(6, 8)}`;

              const eventStartDate = new Date(formattedStartDate);

              let eventStatus;
              if (currentDate < eventStartDate) {
                eventStatus = "진행 예정";
              } else if (currentDate >= eventStartDate) {
                eventStatus = "진행 중";
              } else {
                eventStatus = "진행 완료";
              }

              return (
                <div key={event.id} className="info-box">
                  <p className="event-status">{eventStatus}</p>
                  <img src={event.firstimage} alt={event.title} className="info-image" />
                  <h3>{event.title}</h3>
                  <button
                    className="info-button"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    자세히 보기
                  </button>
                </div>
              );
            })
          ) : (
            <p>행사 정보가 없습니다.</p>
          )}
        </div>
        <p className="info-text">
          더 많은 정보를 보시겠습니까?&nbsp;&nbsp;&nbsp;
          <button className="info-button" onClick={() => navigate("/events")}>
            행사 바로가기
          </button>
        </p>
      </div>
    </div>
  );
};

export default Home;