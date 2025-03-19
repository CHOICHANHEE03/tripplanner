import React, { useState, useEffect, useCallback } from "react";
import Pagination from "./Pagination";
import TourismCategory from "./TourismCategory";
import TourismList from "./TourismList";
import Search from "./Search";
import "../css/TourismList.css";
import "../css/Pagination.css";

const Tourism = () => {
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [selectedArea, setSelectedArea] = useState(""); 
  const [selectedType, setSelectedType] = useState(""); 
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(9); 
  const [searchTerm, setSearchTerm] = useState(""); 

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
          setUsername(null);
        }
      } catch (error) {
        console.error("세션 확인 오류:", error);
        setUsername(null);
      }
    };
    checkSession();
  }, []);

  // 관광 데이터 가져오기 함수
  const fetchData = useCallback(async () => {
    setLoading(true);
    const url = new URL("http://localhost:8080/api/tourism");
    const params = new URLSearchParams();

    if (selectedArea) params.append("areaCode", selectedArea);
    if (selectedType) params.append("contentTypeId", selectedType);
    if (selectedSubCategory) params.append("cat2", selectedSubCategory);

    url.search = params.toString();

    try {
      const response = await fetch(url);
      const result = await response.json();

      console.log("API 응답 데이터:", result);  // 응답 데이터 확인

      if (result && result.length > 0) {
        setData(result);  // 데이터가 배열이라면 바로 설정
        setFilteredData(result);  // 필터링 데이터도 동일하게 설정
      } else {
        console.error("데이터가 없습니다.");
        setData([]);  // 데이터가 없으면 빈 배열 설정
        setFilteredData([]);  // 필터링 데이터도 빈 배열
      }
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      setData([]);  // 오류 발생 시 빈 배열로 설정
      setFilteredData([]);  // 오류 발생 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  }, [selectedArea, selectedType, selectedSubCategory]);

  // 데이터가 처음 로드될 때 호출
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 필터링 로직: 필터가 변경되면 데이터 필터링
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);  // 필터 변경 시 첫 페이지로 리셋
  }, [searchTerm, data]);

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
    else if (filterType === "tourismType") setSelectedType(value);
    else if (filterType === "subCategory") setSelectedSubCategory(value);
    setCurrentPage(1);  // 필터 변경 시 첫 페이지로 리셋
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);  // 검색어 변경 시 첫 페이지로 리셋
  };

  return (
    <div className="tourism-list">
      <Search onSearch={handleSearch} />
      <TourismCategory
        selectedRegion={selectedArea}
        selectedType={selectedType}
        selectedSubCategory={selectedSubCategory}
        onFilterChange={handleFilterChange}
      />
      <TourismList data={currentPageData} loading={loading} />
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

export default Tourism;
