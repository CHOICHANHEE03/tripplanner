import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Tourism/TourismList.css"; // 스타일 파일 불러오기

const TourismList = ({ data, loading }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 사용자 인증 여부 상태

  useEffect(() => {
    // 사용자의 세션을 확인하는 함수
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include", // 쿠키를 포함하여 요청
        });
        const sessionData = await response.json();
        setIsAuthenticated(sessionData.authenticated || false); // 인증 여부 상태 업데이트
      } catch (error) {
        setIsAuthenticated(false); // 오류 발생 시 인증 실패로 설정
      }
    };

    checkSession(); // 세션 확인 함수 호출
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  return (
    <div className="tourism-container">
      <h1>🚌 여행 관광지 리스트</h1> {/* 제목 표시 */}
      <div className="tourism-cards">
        {loading ? (
          <div></div> // 로딩 중일 때 아무것도 표시하지 않음
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map((tourism) => {
            return (
              <div key={tourism.id} className="tourism-card">
                <div className="tourism-card-header">
                  <img src={tourism.firstimage} alt={tourism.title} className="tourism-firstimage" /> {/* 관광지 이미지 */}
                  <h3>{tourism.title}</h3> {/* 관광지 제목 */}
                </div>
                <div className="tourism-card-footer">
                  <button className="info-button" onClick={() => navigate(`/tourism/${tourism.id}`)}> {/* 상세 보기 버튼 */}
                    자세히 보기
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data">
            <div>등록된 관광지가 없습니다.</div> {/* 데이터가 없을 때 메시지 표시 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourismList;