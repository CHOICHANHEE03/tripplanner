import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/TourismDetail.css";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  // const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/event/${id}`);
        if (!response.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUsername(data.user);
        }
      } catch (error) {
        console.error("세션 확인 오류:", error);
      }
    };
    checkSession();
  }, []);

  const handleWriteReview = () => {
    navigate(`/event/review/${event.id}`, { state: { productInfo: event } });
  };

  if (loading) return <p>데이터를 불러오는 중...</p>;
  if (error) return <p>오류 발생: {error}</p>;
  if (!event) return <p>데이터를 찾을 수 없습니다.</p>;

  const validTel = event.tel && event.tel !== "null";

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
    <div className="tourism-detail">
      <img src={event.firstimage} alt={event.title} className="detail-image" />
      <h2>{event.title}</h2>
      <p className="event-status">{eventStatus}</p>
      <p><strong>주소:</strong> {event.addr1}</p>
      {validTel && <p><strong>전화번호:</strong> {event.tel}</p>}
      <div className="button-container">
        <button className="writeReview-button" onClick={handleWriteReview}>리뷰쓰기</button>
        <button onClick={() => navigate(-1)} className="backTour-button">뒤로가기</button>
      </div>
    </div>
  );
};

export default EventDetail;