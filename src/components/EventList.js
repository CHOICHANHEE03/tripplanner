import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TourismList.css";

const EventList = ({ data, loading }) => {
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
      <h1>🚌 여행 행사 리스트</h1>
      <div className="tourism-cards">
        {loading ? (
          <div>Loading...</div>
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map((event) => {
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
              <div key={event.id} className="tourism-card">
                <p className="event-status">{eventStatus}</p>
                <div className="tourism-card-header">
                  <img src={event.firstimage} alt={event.title} className="tourism-firstimage" />
                  <h3>{event.title}</h3>
                </div>
                <div className="tourism-card-footer">
                  <button className="info-button" onClick={() => navigate(`/event/${event.id}`)}>
                    자세히 보기
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data">
            <div>등록된 행사가 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;