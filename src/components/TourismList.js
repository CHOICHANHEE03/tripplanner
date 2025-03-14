import React from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/TourismList.css";

const TourismList = ({ data, favorites, handleLike, loading }) => {
  const navigate = useNavigate();



  return (
    <div className="tourism-container">
      <h1>🚌 여행 관광지 리스트</h1>
      <div className="tourism-cards">
        {loading ? (
          <div>Loading...</div>
        ) : (
          Array.isArray(data) && data.length > 0 ? (
            data.map((tourism) => (
              <div key={tourism.id} className="tourism-card"> 
                <div className="tourism-card-header">
                  <img src={tourism.firstimage} alt={tourism.title} className="tourism-firstimage"/>
                  <h3>{tourism.title}</h3>
                  <p className="truncated-text">{tourism.overview}</p>
                </div>
                <div className="tourism-card-footer">
                  <button 
                    className="info-button" 
                    onClick={() => navigate(`/tourism/${tourism.id}`)}
                  >
                    자세히 보기
                  </button>
                  <button
                    className="like-button"
                    onClick={() => handleLike(tourism)}
                    style={{
                      color: favorites.some((fav) => fav.id === tourism.id)
                        ? "#FF6B6B"
                        : "black",
                    }}
                  >
                    {favorites.some((fav) => fav.id === tourism.id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No data available</div>
          )
        )}
      </div>
    </div>
  );
};


export default TourismList;