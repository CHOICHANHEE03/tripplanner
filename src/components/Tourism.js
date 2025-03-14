import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import TourismCategory from "./TourismCategory";
import TourismList from "./TourismList";
import "../css/TourismList.css";
import "../css/Pagination.css";

const Tourism = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.authenticated) {
          setUserId(data.userId);
        }
      } catch (error) {
        console.error("세션 확인 실패:", error);
      }
    };

    checkSession();
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8080/favorites/${userId}`);
      const result = await response.json();
      setFavorites(result);
    } catch (error) {
      console.error("찜 목록 가져오기 오류:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const url = new URL("http://localhost:8080/api/tourism");
    const params = new URLSearchParams();

    if (selectedArea) params.append("areaCode", selectedArea);
    if (selectedType) params.append("contentTypeId", selectedType);
    if (selectedSubCategory) params.append("subCategory", selectedSubCategory);

    params.append("page", currentPage);
    params.append("size", 9);
    url.search = params.toString();

    try {
      const response = await fetch(url);
      const result = await response.json();

      setData(result.content);
      setTotalCount(result.totalCount);
      setPageNumbers(getPageNumbers(currentPage, Math.ceil(result.totalCount / 9)));
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedArea, selectedType, selectedSubCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ fetchData를 의존성 배열에 추가

  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "region") setSelectedArea(value);
    else if (filterType === "tourismType") setSelectedType(value);
    else if (filterType === "subCategory") setSelectedSubCategory(value);
    setCurrentPage(1);
  };

  const handleLike = async (tourism) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/favorites", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, tourismId: tourism.id }),
      });

      if (!response.ok) {
        throw new Error("찜 추가 실패");
      }

      const newFavorite = await response.json();
      setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
      fetchFavorites();
      console.log("찜 추가 성공");
    } catch (error) {
      console.error("찜 추가 오류:", error);
      alert(error.message);
    }
  };

  const handleUnlike = async (favoriteId) => {
    try {
      const response = await fetch(`http://localhost:8080/favorites/${favoriteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("찜 삭제 실패");
      }

      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));
      fetchFavorites();
      console.log("찜 삭제 성공");
    } catch (error) {
      console.error("찜 삭제 오류:", error);
    }
  };

  return (
    <div className="tourism-list">
      <TourismCategory
        selectedRegion={selectedArea}
        selectedType={selectedType}
        selectedSubCategory={selectedSubCategory}
        onFilterChange={handleFilterChange}
      />
      <TourismList data={data} favorites={favorites} handleLike={handleLike} handleUnlike={handleUnlike} />
      <Pagination currentPage={currentPage} totalPages={Math.ceil(totalCount / 9)} handlePageChange={setCurrentPage} pageNumbers={pageNumbers} />
    </div>
  );
};

export default Tourism;