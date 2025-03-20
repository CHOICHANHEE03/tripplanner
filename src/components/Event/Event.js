import React, { useState, useEffect, useCallback } from "react";
import Pagination from "../Function/Pagination";
import EventCategory from "./EventCategory";
import EventList from "./EventList";
import SearchTerm from "../Function/SearchTerm";
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    let allData = []; // 모든 데이터를 저장할 배열
    let page = 0; // 첫 번째 페이지부터 시작
    let totalPages = 1; // 초기값 (API 요청 후 업데이트)

    try {
      while (page < totalPages) {
        const url = new URL("http://localhost:8080/api/event");
        const params = new URLSearchParams();

        // 필터링 값 추가
        if (selectedArea) params.append("areaCode", selectedArea);
        if (selectedSubCategory) params.append("cat2", selectedSubCategory);
        if (searchTerm.trim().length > 0) params.append("search", searchTerm);
        params.append("page", page);
        params.append("size", itemsPerPage || 9); // 기본값 9개

        url.search = params.toString();

        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log(`페이지 ${page + 1} 응답:`, result);

        if (result && result.data && result.data.length > 0) {
          allData = [...allData, ...result.data];
          totalPages = result.totalPages || 1;
        }

        page++;
      }

      setData(allData);
      setFilteredData(allData);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedArea, selectedSubCategory, searchTerm, itemsPerPage]);

  // 데이터가 처음 로드될 때 호출
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 페이지에 맞는 데이터 가져오기
  const currentPageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
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
      <SearchTerm onSearch={handleSearch} />
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