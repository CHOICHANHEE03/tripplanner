import React, { useState, useEffect, useCallback } from "react";
import Pagination from "../Function/Pagination";
import EventCategory from "./EventCategory";
import EventList from "./EventList";
import Search from "../Function/Search";
import "../../css/Tourism/TourismList.css";
import "../../css/Function/Pagination.css";

const Event = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/session", { // JWT가 적용된 URL로 변경
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.authenticated && data.user) {
          setUsername(data.user);
        } else {
          setUsername(null);
        }
      } catch (error) {
        setUsername(null);
      }
    };
    checkSession();
  }, []);

  // 행사 데이터 가져오기 함수
  const fetchData = useCallback(async () => {
    setLoading(true);

    // 요청 URL과 파라미터 설정
    const url = new URL("http://localhost:8080/api/event");
    const params = new URLSearchParams();

    // 필터링 값 추가
    if (selectedArea) params.append("areaCode", selectedArea);
    if (selectedSubCategory) params.append("cat2", selectedSubCategory);
    if (searchTerm) params.append("search", searchTerm); // 검색어 추가
    params.append("page", currentPage); // 페이지 번호
    params.append("size", itemsPerPage); // 페이지당 항목 수

    url.search = params.toString();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, { // JWT가 적용된 URL로 변경
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("API 응답 데이터:", result);  // 응답 데이터 확인

      if (result && result.data && result.data.length > 0) {
        setData(result.data);
        setFilteredData(result.data);
      } else {
        setData([]);  // 데이터가 없으면 빈 배열 설정
        setFilteredData([]);  // 필터링 데이터도 빈 배열
      }
    } catch (error) {
      setData([]);  // 오류 발생 시 빈 배열로 설정
      setFilteredData([]);  // 오류 발생 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  }, [selectedArea, selectedSubCategory, currentPage, itemsPerPage, searchTerm]);

  // 데이터가 처음 로드될 때 호출
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 페이지에 맞는 데이터 가져오기
  const currentPageData = filteredData;

  const getPageNumbers = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "region") setSelectedArea(value);
    else if (filterType === "subCategory") setSelectedSubCategory(value);
    setCurrentPage(1);  // 필터 변경 시 첫 페이지로 리셋
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // 검색어 변경 시 첫 페이지로 리셋

    if (term.trim() !== "") {
      setSelectedArea(""); // 검색어가 있으면 지역을 전체("")로 설정
    }
  };

  return (
    <div className="tourism-list">
      <Search onSearch={handleSearch} />
      <EventCategory
        selectedRegion={selectedArea}
        selectedSubCategory={selectedSubCategory}
        onFilterChange={handleFilterChange}
      />
      <EventList data={currentPageData} loading={loading} />
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / itemsPerPage)}
          handlePageChange={handlePageChange}
          pageNumbers={getPageNumbers()}
        />
      )}
    </div>
  );
};

export default Event;