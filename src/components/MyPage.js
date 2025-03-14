import React, { useEffect, useState, useCallback } from "react";
import "../css/MyPage.css";
import { FaHeartBroken } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // 세션 확인
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
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("세션 확인 실패:", error);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  // 목록 불러오기
  const fetchFavorites = useCallback(async () => {
    if (!username) return;

    try {
      const response = await fetch(`http://localhost:8080/favorites/${username}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("찜 목록 불러오기 실패");

      const data = await response.json();
      console.log("찜 목록 데이터:", data);

      // 데이터 유효성 검사 후 상태 업데이트
      if (Array.isArray(data)) {
        setFavorites(data);
      } else {
        console.warn("찜 목록 응답이 배열이 아닙니다:", data);
        setFavorites([]);
      }
    } catch (error) {
      console.error("찜 목록 가져오기 오류:", error);
      setFavorites([]);
    }
  }, [username]);

  // username 바뀌면 찜 목록 불러오기
  useEffect(() => {
    if (username) {
      console.log("현재 로그인한 사용자:", username);
      fetchFavorites();
    }
  }, [username, fetchFavorites]);

  // 찜 삭제 함수
  const removeFavorite = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/favorites/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("찜 삭제 요청 실패");

      // 삭제 후 목록 갱신
      setFavorites((prev) => prev.filter((place) => place.id !== id));
    } catch (error) {
      console.error("찜 삭제 오류:", error);
    }
  };

  return (
    <div className="mypage-section">
      <h2>❤️ 찜한 관광지</h2>
      {favorites.length === 0 ? (
        <p>찜한 관광지가 없습니다.</p>
      ) : (
        <div className="mypage-grid">
          {favorites.map((place) => (
            <div key={place.id} className="mypage-card">
              {place.tourism?.firstimage && (
                <img src={place.tourism.firstimage} alt={place.tourism.title} className="card-img" />
              )}
              <h3>{place.tourism?.title}</h3>
              <button className="remove-button" onClick={() => removeFavorite(place.id)}>
                <FaHeartBroken /> 삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPage;