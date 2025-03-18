import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TourismList.css";

const TourismList = ({ data, loading }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <div className="tourism-container">
      <h1>🚌 여행 관광지 리스트</h1>
      <div className="tourism-cards">
        {loading ? (
          <div>Loading...</div>
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map((tourism) => {

            return (
              <div key={tourism.id} className="tourism-card">
                <div className="tourism-card-header">
                  <img src={tourism.firstimage} alt={tourism.title} className="tourism-firstimage" />
                  <h3>{tourism.title}</h3>
                </div>
                <div className="tourism-card-footer">
                  <button className="info-button" onClick={() => navigate(`/tourism/${tourism.id}`)}>
                    자세히 보기
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data">
            <div>등록된 관광지가 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourismList;