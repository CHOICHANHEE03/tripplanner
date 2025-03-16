import React, { useState, useEffect, useCallback } from "react";
import Pagination from "./Pagination";
import EventCategory from "./EventCategory";
import EventList from "./EventList";
import "../css/TourismList.css";
import "../css/Pagination.css";

const Event = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentGroup, setCurrentGroup] = useState(0);

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    const url = new URL("http://localhost:8080/api/event");
    const params = new URLSearchParams();

    if (selectedArea) params.append("areaCode", selectedArea);
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
  }, [currentPage, selectedArea, selectedSubCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handleGroupChange = (direction) => {
    const totalPages = Math.ceil(totalCount / 9);
    const totalGroups = Math.ceil(totalPages / 5);

    const newGroup = currentGroup + direction;

    if (newGroup >= 0 && newGroup < totalGroups) {
      setCurrentGroup(newGroup);
      setCurrentPage(newGroup * 5 + 1);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "region") setSelectedArea(value);
    else if (filterType === "subCategory") setSelectedSubCategory(value);
    setCurrentPage(1);
  };

  return (
    <div className="tourism-list">
      <EventCategory
        selectedRegion={selectedArea}
        selectedSubCategory={selectedSubCategory}
        onFilterChange={handleFilterChange}
      />
      <EventList
        data={data}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / 9)}
        handlePageChange={setCurrentPage}
        pageNumbers={pageNumbers}
        currentGroup={currentGroup}
        onGroupChange={handleGroupChange}
      />
    </div>
  );
};

export default Event;