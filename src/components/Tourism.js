import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import TourismCategory from "./TourismCategory";
import TourismList from "./TourismList";
import "../css/TourismList.css";
import "../css/Pagination.css";

const Tourism = () => {
  const [data, setData] = useState([]); // 기본값을 빈 배열로 설정
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [pageNumbers, setPageNumbers] = useState([]); // 페이지 번호 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [favorites, setFavorites] = useState([]); // 찜 목록

  const [selectedArea, setSelectedArea] = useState(""); // 선택된 지역
  const [selectedType, setSelectedType] = useState(""); // 선택된 관광지 타입
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // 선택된 세부 카테고리

  // 데이터 fetching 함수
  const fetchData = async (page, areaCode, contentTypeId, cat2) => {
    setLoading(true);
    const url = new URL("http://localhost:8080/api/tourism");
    const params = new URLSearchParams();

    // 선택된 필터들만 파라미터로 추가
    if (areaCode) params.append("areaCode", areaCode);
    if (contentTypeId) params.append("contentTypeId", contentTypeId);
    if (cat2) params.append("subCategory", cat2);

    // 페이지 관련 파라미터 추가
    params.append("page", page); // 현재 페이지 추가
    params.append("size", 9); // 페이지당 9개씩 요청

    url.search = params.toString();

    try {
      const response = await fetch(url);
      const result = await response.json();

      setData(result.content); // result.content는 실제 관광지 리스트
      setTotalCount(result.totalCount); // 전체 데이터 개수

      // 페이지네이션을 위한 총 페이지 수 계산
      const totalPages = Math.ceil(result.totalCount / 9); // 백엔드에서 9개씩 제공
      setPageNumbers(getPageNumbers(page, totalPages)); // 페이지 번호 리스트 설정
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 번호 계산 함수
  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1; // 현재 페이지에 맞춰 시작 페이지 계산
    const endPage = Math.min(startPage + 4, totalPages); // 끝 페이지는 5개로 제한

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

   // 페이지 변경 시 호출되는 함수
   const handlePageChange = (page) => {
    setCurrentPage(page); // 페이지 상태 변경
  };
  // 필터 변경 시 호출되는 함수
  const handleFilterChange = (filterType, value) => {
    if (filterType === "region") {
      setSelectedArea(value);
    } else if (filterType === "tourismType") {
      setSelectedType(value);
    } else if (filterType === "subCategory") {
      setSelectedSubCategory(value);
    }

    setCurrentPage(1); // 필터가 변경되면 페이지를 첫 번째로 리셋
  };

  useEffect(() => {
    fetchData(currentPage, selectedArea, selectedType, selectedSubCategory);
  }, [currentPage, selectedArea, selectedType, selectedSubCategory]);

  // 찜 목록 로딩
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleLike = (tourism) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isAlreadyFavorite = storedFavorites.some(
      (fav) => fav.id === tourism.id
    );

    let updatedFavorites;
    if (isAlreadyFavorite) {
      updatedFavorites = storedFavorites.filter((fav) => fav.id !== tourism.id);
    } else {
      updatedFavorites = [...storedFavorites, tourism];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="tourism-list">
      {/* 지역, 관광지 타입, 세부 카테고리 필터링 컴포넌트 */}
      <TourismCategory
        selectedRegion={selectedArea}
        selectedType={selectedType}
        selectedSubCategory={selectedSubCategory}
        onFilterChange={handleFilterChange}
      />

<TourismList data={data} favorites={favorites} handleLike={handleLike} />


      {/* 페이지네이션 컴포넌트 */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / 9)} // 서버에서 제공하는 총 데이터 개수를 바탕으로 총 페이지 수 계산
        handlePageChange={handlePageChange}
        pageNumbers={pageNumbers}
      />
    </div>
  );
};

export default Tourism;
