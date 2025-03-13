import React, { useState, useEffect } from "react";
import TourismList from "./TourismList";
import Pagination from "./Pagination";
import TourismCategory from "./TourismCategory"
import "../css/TourismList.css";
import "../css/Pagination.css";

const Tourism = () => {
  const [data, setData] = useState([]); // 관광지 목록
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [pageNumbers, setPageNumbers] = useState([]); // 페이지 번호 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const pageSize = 9; // 고정된 페이지당 항목 수
  const [favorites, setFavorites] = useState([]);
  
  const [selectedArea, setSelectedArea] = useState(""); // 선택된 지역카테고리
  const [selectedType, setSelectedType] = useState(""); // 선택된 관광지 타입
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // 선택된 세부 카테고리

  // API 호출 함수
  const fetchData = async (page, areacode, contenttypeid, cat2) => {
    const response = await fetch("https://d4046c3d-95c1-42a1-ae9a-4ca7bf1c5570.mock.pstmn.io/api/tourism");
    const result = await response.json();

  // 필터링
  const filteredData = result.filter((item) => {
    const isAreaMatch = areacode ? item.areacode === areacode : true;
    const isTypeMatch = contenttypeid ? item.contenttypeid === contenttypeid : true;
    const isSubCategoryMatch = cat2 ? item.cat2 === cat2 : true;
    return isAreaMatch && isTypeMatch && isSubCategoryMatch; // 모든 조건을 AND로 연결
  });

    // 데이터를 페이지별로 나눔
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

    setData(paginatedData);
    setTotalCount(filteredData.length); // 전체 데이터 개수

    if (page === 1) {
      setLoading(false); // 처음 로딩
    }
  };

  useEffect(() => {
    fetchData(currentPage, selectedArea, selectedType, selectedSubCategory);
  }, [currentPage, selectedArea, selectedType, selectedSubCategory]);

  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1; // 현재 페이지에 맞춰 시작 페이지 계산
    const endPage = Math.min(startPage + 4, totalPages); // 끝 페이지는 5개로 제한

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  useEffect(() => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pageNumbers = getPageNumbers(currentPage, totalPages);
    setPageNumbers(pageNumbers); // 페이지 번호 리스트 갱신
  }, [currentPage, totalCount]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleFilterChange = (filterType, value) => {
    // 필터 종류에 따라 다른 상태를 업데이트
    if (filterType === 'region') {
      setSelectedArea(value);
    } else if (filterType === 'tourismType') {
      setSelectedType(value);
    } else if (filterType === 'subCategory') {
      setSelectedSubCategory(value);
    }
    
    // 페이지 초기화
    setCurrentPage(1);
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleLike = (tourism) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isAlreadyFavorite = storedFavorites.some((fav) => fav.id === tourism.id);

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
      {/* Tourism List Component */}
      <TourismList data={data} favorites={favorites} handleLike={handleLike} />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        pageNumbers={pageNumbers}
      />
    </div>
  );
};

export default Tourism;