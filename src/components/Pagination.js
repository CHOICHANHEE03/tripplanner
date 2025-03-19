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
  const pageGroupSize = 5; // 한 그룹에 포함되는 페이지 수
  const maxGroup = Math.max(0, Math.floor((totalPages - 1) / pageGroupSize)); // 그룹의 최댓값 계산
  const isSingleGroup = totalPages <= pageGroupSize; // 그룹이 하나뿐이라면 그룹 이동 버튼 비활성화

  return (
    <div className="pagination-container">
      {/* 이전 그룹으로 이동 */}
      <button
        onClick={() => onGroupChange(-1)} // 그룹을 -1 (이전)으로 이동
        className="page-nav-btn"
        disabled={currentGroup === 0 || isSingleGroup} // 첫 그룹이거나 그룹이 하나뿐이면 비활성화
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
        disabled={currentGroup >= maxGroup || isSingleGroup} // 마지막 그룹이거나 그룹이 하나뿐이면 비활성화
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;