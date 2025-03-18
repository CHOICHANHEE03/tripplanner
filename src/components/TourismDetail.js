import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/TourismDetail.css";

const TourismDetail = () => {
  const { id } = useParams(); // URL에서 관광지 ID를 가져옴
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 함수
  const [tourism, setTourism] = useState(null); // 관광지 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태
  const [username, setUsername] = useState(null); // 로그인한 사용자 정보 상태

  // 특정 관광지 정보를 가져오는 함수
  useEffect(() => {
    const fetchTourismData = async () => {
      setLoading(true);
      try {
        // API 호출을 통해 관광지 데이터 가져오기
        const response = await fetch(`http://localhost:8080/api/tourism/${id}`);
        if (!response.ok) throw new Error("데이터를 불러오는 데 실패했습니다."); // 응답 실패 시 에러 발생
        const data = await response.json();
        setTourism(data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        setError(error.message); // 에러 발생 시 상태에 저장
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };
    fetchTourismData(); // 함수 실행
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
    navigate(`/tourism/review/${tourism.id}`, { state: { productInfo: tourism } });
  };

  // 데이터 로딩 중일 때 표시할 메시지
  if (loading) return <p></p>;
  // 에러 발생 시 표시할 메시지
  if (error) return <p>오류 발생: {error}</p>;
  // 관광지 데이터가 없을 때 표시할 메시지
  if (!tourism) return <p>데이터를 찾을 수 없습니다.</p>;

  // 전화번호가 유효한지 확인
  const validTel = tourism.tel && tourism.tel !== "null";

  return (
    <div className="tourism-detail">
      {/* 관광지 대표 이미지 */}
      <img src={tourism.firstimage} alt={tourism.title} className="detail-image" />
      <h2>{tourism.title}</h2> {/* 관광지 제목 */}
      <p><strong>주소:</strong> {tourism.addr1}</p> {/* 관광지 주소 */}
      {validTel && <p><strong>전화번호:</strong> {tourism.tel}</p>} {/* 전화번호가 있을 경우 표시 */}

      <div className="button-container">
        {/* 리뷰 작성 버튼 */}
        <button className="writeReview-button" onClick={handleWriteReview}>리뷰쓰기</button>
        {/* 이전 페이지로 이동 버튼 */}
        <button onClick={() => navigate(-1)} className="backTour-button">뒤로가기</button>
      </div>
    </div>
  );
};

export default TourismDetail;