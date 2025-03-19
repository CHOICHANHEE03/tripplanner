import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/Tourism/TourismDetail.css";

const EventDetail = () => {
  const { id } = useParams(); // URL에서 이벤트 ID를 가져옴
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 함수
  const [event, setEvent] = useState(null); // 이벤트 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [username, setUsername] = useState(null); // 로그인한 사용자 정보 상태

  // 특정 이벤트 정보를 가져오는 함수
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        // API 호출을 통해 이벤트 데이터 가져오기
        const response = await fetch(`http://localhost:8080/api/event/${id}`);
        if (!response.ok) throw new Error("데이터를 불러오는 데 실패했습니다."); // 응답 실패 시 에러 발생
        const data = await response.json();
        setEvent(data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        setError(error.message); // 에러 발생 시 상태에 저장
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };
    fetchEventData(); // 함수 실행
  }, [id]); // id 값이 변경될 때마다 실행

  // 사용자 로그인 여부 확인하는 함수
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include", // 쿠키 포함하여 요청
        });
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUsername(data.user); // 로그인된 사용자 정보 저장
        }
      } catch (error) {
        // 오류 발생 시 무시
      }
    };
    checkSession(); // 함수 실행
  }, []);

  // 리뷰 작성 버튼 클릭 시 리뷰 작성 페이지로 이동
  const handleWriteReview = () => {
    navigate(`/event/review/${event.id}`, { state: { productInfo: event } });
  };

  // 데이터 로딩 중일 때 표시할 메시지
  if (loading) return <p></p>;
  // 에러 발생 시 표시할 메시지
  if (error) return <p>오류 발생: {error}</p>;
  // 이벤트 데이터가 없을 때 표시할 메시지
  if (!event) return <p>데이터를 찾을 수 없습니다.</p>;

  // 전화번호가 유효한지 확인
  const validTel = event.tel && event.tel !== "null";

  // 이벤트 시작 날짜 처리
  const currentDate = new Date(); // 현재 날짜 가져오기
  const rawStartDate = event.eventStartDate; // API에서 받은 날짜 문자열
  const formattedStartDate = `${rawStartDate.slice(0, 4)}-${rawStartDate.slice(4, 6)}-${rawStartDate.slice(6, 8)}`; // YYYY-MM-DD 형식으로 변환

  const eventStartDate = new Date(formattedStartDate); // 변환된 날짜를 Date 객체로 생성

  // 이벤트 상태 결정
  let eventStatus;
  if (currentDate < eventStartDate) {
    eventStatus = "진행 예정"; // 현재 날짜가 이벤트 시작 전일 경우
  } else if (currentDate >= eventStartDate) {
    eventStatus = "진행 중"; // 현재 날짜가 이벤트 시작일 이후일 경우
  } else {
    eventStatus = "진행 완료"; // 기타 경우
  }

  return (
    <div className="tourism-detail">
      {/* 이벤트 대표 이미지 */}
      <img src={event.firstimage} alt={event.title} className="detail-image" />
      <h2>{event.title}</h2> {/* 이벤트 제목 */}
      <p className="event-status">{eventStatus}</p> {/* 이벤트 진행 상태 */}
      <p><strong>주소:</strong> {event.addr1}</p> {/* 이벤트 주소 */}
      {validTel && <p><strong>전화번호:</strong> {event.tel}</p>} {/* 전화번호가 있을 경우 표시 */}

      <div className="button-container">
        {/* 리뷰 작성 버튼 (로그인한 사용자만 가능) */}
        <button className="writeReview-button" onClick={handleWriteReview}>리뷰쓰기</button>
        {/* 이전 페이지로 이동 버튼 */}
        <button onClick={() => navigate(-1)} className="backTour-button">뒤로가기</button>
      </div>
    </div>
  );
};

export default EventDetail;