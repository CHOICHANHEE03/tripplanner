import React, { useState, useEffect } from "react";
import TourismList from "./TourismList";
import Pagination from "./Pagination";
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

  // API 호출 함수
  const fetchData = async (page) => {
    const response = await fetch("https://880821db-ae00-4642-919d-632e6a038644.mock.pstmn.io/api/tourism");
    const result = await response.json();


    // 데이터를 페이지별로 나눔
    const startIndex = (page - 1) * pageSize;
    const paginatedData = result.slice(startIndex, startIndex + pageSize);

    setData(paginatedData);
    setTotalCount(result.length); // 전체 데이터 개수

    if (page === 1) {
      setLoading(false); // 처음 로딩
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

  // 페이지가 바뀔 때마다 데이터 재호출 및 페이지 번호 계산
  useEffect(() => {
    fetchData(currentPage); // 페이지 변경 시 데이터 호출
  }, [currentPage]);

  useEffect(() => {
    const totalPages = Math.ceil(totalCount / pageSize);
    const pageNumbers = getPageNumbers(currentPage, totalPages);
    setPageNumbers(pageNumbers); // 페이지 번호 리스트 갱신
  }, [currentPage, totalCount]);

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

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
