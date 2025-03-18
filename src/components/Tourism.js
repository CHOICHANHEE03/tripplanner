import React, { useState, useEffect, useCallback } from "react";
import Pagination from "./Pagination";
import TourismCategory from "./TourismCategory";
import TourismList from "./TourismList";
import Search from "./Search";
import "../css/TourismList.css";
import "../css/Pagination.css";

const Tourism = () => {
  // 상태 관리
  const [data, setData] = useState([]); // 전체 관광 데이터
  const [filteredData, setFilteredData] = useState([]); // 검색 필터링된 데이터
  const [totalCount, setTotalCount] = useState(0); // 전체 데이터 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [pageNumbers, setPageNumbers] = useState([]); // 페이지네이션 번호 리스트
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [username, setUsername] = useState(null); // 로그인된 사용자 이름
  const [selectedArea, setSelectedArea] = useState(""); // 선택된 지역 코드
  const [selectedType, setSelectedType] = useState(""); // 선택된 관광 타입
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // 선택된 서브 카테고리
  const [currentGroup, setCurrentGroup] = useState(0); // 현재 페이지 그룹
  const [searchTerm, setSearchTerm] = useState(""); // 검색어

  // 사용자 세션 확인
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

    // 선택된 필터 값 적용
    if (selectedArea) params.append("areaCode", selectedArea);
    if (selectedType) params.append("contentTypeId", selectedType);
    if (selectedSubCategory) params.append("cat2", selectedSubCategory);

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

  // 컴포넌트 마운트 및 필터 변경 시 데이터 가져옴
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 입력한 검색어로 데이터 필터링
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  // 페이지 번호 그룹을 계산하는 함수 (5개씩 그룹화)
  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // 페이지 그룹 변경 핸들러
  const handleGroupChange = (direction) => {
    const totalPages = Math.ceil(totalCount / 9);
    const totalGroups = Math.ceil(totalPages / 5);

    const newGroup = currentGroup + direction;

    if (newGroup >= 0 && newGroup < totalGroups) {
      setCurrentGroup(newGroup);
      setCurrentPage(newGroup * 5 + 1);
    }
  };

  // 필터 변경 핸들러 (지역, 타입, 카테고리 변경)
  const handleFilterChange = (filterType, value) => {
    if (filterType === "region") setSelectedArea(value);
    else if (filterType === "tourismType") setSelectedType(value);
    else if (filterType === "subCategory") setSelectedSubCategory(value);

    setCurrentPage(1);
    setSearchTerm((prevSearchTerm) => prevSearchTerm);
  };

  // 검색 핸들러
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredData(data);
    }
    setCurrentPage(1);
  };

  // 검색어 변경 시 데이터 다시 가져오기
  useEffect(() => {
    fetchData();
  }, [fetchData, searchTerm]);

  return (
    <div className="tourism-list">
      {/* 검색창 컴포넌트 */}
      <Search onSearch={handleSearch} />

      {/* 관광 필터 (지역, 타입, 카테고리) */}
      <TourismCategory
        selectedRegion={selectedArea}
        selectedType={selectedType}
        selectedSubCategory={selectedSubCategory}
        onFilterChange={handleFilterChange}
      />

      {/* 관광 리스트 컴포넌트 */}
      <TourismList data={filteredData} loading={loading} />

      {/* 페이지네이션 컴포넌트 */}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / 9)}
          handlePageChange={setCurrentPage}
          pageNumbers={pageNumbers}
          currentGroup={currentGroup}
          onGroupChange={handleGroupChange}
        />
      )}
    </div>
  );
};

export default Tourism;