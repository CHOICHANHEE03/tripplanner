import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../css/TourismList.css";

const TourismList = ({ data, favorites, handleLike, handleUnlike, loading }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFavoritesLoaded, setIsFavoritesLoaded] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });
        const sessionData = await response.json();
        setIsAuthenticated(sessionData.authenticated || false);
      } catch (error) {
        console.error("세션 확인 실패:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (favorites !== null) {
      setIsFavoritesLoaded(true);
    }
  }, [favorites]);

  if (!isFavoritesLoaded) {
    return <div>Loading favorites...</div>;
  }

  return (
    <div className="tourism-container">
      <h1>🚌 여행 관광지 리스트</h1>
      <div className="tourism-cards">
        {loading ? (
          <div>Loading...</div>
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map((tourism) => {
            const isFavorite = favorites && favorites.some((fav) => fav.tourismId === tourism.id);
            const favoriteItem = favorites && favorites.find((fav) => fav.tourismId === tourism.id);

            return (
              <div key={tourism.id} className="tourism-card">
                <div className="tourism-card-header">
                  <img src={tourism.firstimage} alt={tourism.title} className="tourism-firstimage" />
                  <h3>{tourism.title}</h3>
                  <p className="truncated-text">{tourism.overview}</p>
                </div>
                <div className="tourism-card-footer">
                  <button className="info-button" onClick={() => navigate(`/tourism/${tourism.id}`)}>
                    자세히 보기
                  </button>

                  {isAuthenticated ? (
                    <button
                      className="like-button"
                      onClick={() => (isFavorite ? handleUnlike(favoriteItem.id) : handleLike(tourism))}
                      style={{ color: isFavorite ? "#FF6B6B" : "black" }}
                      disabled={!isFavoritesLoaded}
                    >
                      {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  ) : (
                    <button className="like-button" onClick={() => alert("로그인이 필요합니다.")}>
                      <FaRegHeart />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
};

export default TourismList;