import React from "react";
import "../css/Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  pageNumbers,
  handlePageChange, // 여기서 handlePageChange를 props로 받음
  currentGroup,
  onGroupChange,
}) => {
  return (
    <div className="pagination-container">
      {/* 이전 그룹으로 이동 */}
      <button
        onClick={() => onGroupChange(-1)} // 그룹을 -1 (이전)으로 이동
        className="page-nav-btn"
        disabled={currentGroup === 0} // 첫 그룹에서는 이전 그룹으로 이동 불가능
      >
        &lt;
      </button>

      {/* 페이지 번호 버튼 */}
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}  // 페이지 번호 클릭 시 페이지 변경
          className={`page-nav-btn ${currentPage === pageNum ? "active" : ""}`}
        >
          {pageNum}
        </button>
      ))}

      {/* 다음 그룹으로 이동 */}
      <button
        onClick={() => onGroupChange(1)} // 그룹을 +1 (다음)으로 이동
        className="page-nav-btn"
        disabled={currentGroup === Math.floor((totalPages - 1) / 5)} // 마지막 그룹에서는 다음 그룹으로 이동 불가능
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
