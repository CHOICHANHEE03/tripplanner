import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

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
        <div class="info-section">
            <h2>최신 관광지 정보</h2>
            <div className="info-container">
                <div className="info-box"></div>
                <div className="info-box"></div>
                <div className="info-box"></div>
            </div>
            <p class="info-text">더 많은 정보를 보시겠습니까?&nbsp;&nbsp;&nbsp;
                <button className="info-button" onClick={handleTourismClick}>관광지 바로가기</button>
            </p>
            </div>
                <div class="info-section">
                <h2>최신 행사 정보</h2>
                <div className="info-container">
                    <div className="info-box"></div>
                    <div className="info-box"></div>
                    <div className="info-box"></div>
                </div>
                <p class="info-text">더 많은 정보를 보시겠습니까?&nbsp;&nbsp;&nbsp;
                    <button className="info-button" onClick={handleEventsClick}>행사 바로가기</button>
                </p>
            </div>
          </div>
        
    );
};

export default Home;