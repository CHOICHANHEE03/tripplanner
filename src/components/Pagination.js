import React from "react";
import "../css/Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  currentGroup,
  onPageChange,
  onGroupChange,
}) => {
  const generatePageNumbers = () => {
    const startPage = currentGroup * 5;
    const endPage = Math.min(startPage + 4, totalPages - 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i + 1); // 페이지 번호는 1부터 시작
    }
    return pageNumbers;
  };

  return (
    <div className="pagination-container">
      <button
        onClick={() => onGroupChange(-1)}
        disabled={currentGroup === 0}
        className="page-nav-btn"
      >
        &lt;
      </button>

      {generatePageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)} // 페이지 번호 클릭 시 onPageChange 호출
          className={`page-nav-btn ${currentPage === pageNum ? "active" : ""}`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => onGroupChange(1)}
        disabled={currentGroup === Math.floor((totalPages - 1) / 5)}
        className="page-nav-btn"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
