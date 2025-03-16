import React, { useEffect, useState, useCallback } from "react";
import "../css/MyPage.css";
import { FaHeartBroken } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

const MyPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  // 카테고리(유형) 옵션
  const contentTypes = [
    { id: "12", name: "관광지" },
    { id: "14", name: "문화시설" },
    { id: "28", name: "레포츠" },
  ];

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

  // 찜 목록 가져오기
  // 찜 목록 가져오기
  const fetchFavorites = useCallback(async () => {
    if (!username) return;

    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: itemsPerPage,
      });

      // 선택된 카테고리가 'all'이 아니면 contentTypeId 파라미터 추가
      if (selectedType !== "all") {
        params.append("contentTypeId", selectedType);
      }

      const response = await fetch(
        `http://localhost:8080/api/favorites/${username}?${params.toString()}`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) throw new Error("찜 목록 불러오기 실패");

      const data = await response.json();
      console.log("찜 목록 데이터:", data);

      if (data?.content && Array.isArray(data.content)) {
        setFavorites(data.content);
        setTotalCount(data.totalElements);
        setPageNumbers(getPageNumbers(1, Math.ceil(data.totalElements / itemsPerPage)));
      } else {
        setFavorites([]);
        setTotalCount(0);
        setPageNumbers([]);
      }
    } catch (error) {
      console.error("찜 목록 가져오기 오류:", error);
      setFavorites([]);
      setTotalCount(0);
      setPageNumbers([]);
    }
  }, [username, currentPage, selectedType]);

  useEffect(() => {
    if (username) {
      fetchFavorites();
    }
  }, [username, currentPage, fetchFavorites]);

  // 찜 삭제 함수
  const removeFavorite = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/favorites/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("찜 삭제 요청 실패");

      setFavorites((prev) => prev.filter((place) => place.id !== id));
      setTotalCount((prev) => prev - 1);

      // 삭제 후 데이터 다시 가져오기
      fetchFavorites();
    } catch (error) {
      console.error("찜 삭제 오류:", error);
    }
  };

  // 페이지네이션 숫자 배열 생성 함수
  const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 1) return [1];

    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // 현재 선택된 카테고리에 따라 필터링
  const filteredFavorites =
    selectedType === "all"
      ? favorites
      : favorites.filter(
        (place) => place.tourism?.contentTypeId?.toString() === selectedType
      );

  // ✅ 총 페이지 수보다 currentPage가 크면 1페이지로 초기화
  useEffect(() => {
    if (totalCount === 0) {
      setCurrentPage(1);
    } else if (currentPage > Math.ceil(totalCount / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [totalCount, currentPage]);

  return (
    <div className="mypage-section">
      <h2>❤️ 찜한 관광지</h2>
      <div className="filter-section">
        <label>카테고리 선택:</label>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="all">전체</option>
          {contentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {filteredFavorites.length === 0 ? (
        <p>선택한 카테고리에 찜한 관광지가 없습니다.</p>
      ) : (
        <>
          <div className="mypage-grid">
            {filteredFavorites.map((place) => (
              <div key={place.id} className="mypage-card">
                {place.tourism?.firstimage && (
                  <img
                    src={place.tourism.firstimage}
                    alt={place.tourism.title}
                    className="card-img"
                  />
                )}
                <h3>{place.tourism?.title}</h3>
                <button className="remove-button" onClick={() => removeFavorite(place.id)}>
                  <FaHeartBroken /> 삭제
                </button>
              </div>
            ))}
          </div>

          {totalCount > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / itemsPerPage)}
              handlePageChange={setCurrentPage}
              pageNumbers={pageNumbers}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyPage;