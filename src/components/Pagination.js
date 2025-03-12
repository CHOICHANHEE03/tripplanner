import React from "react";
import "../css/Pagination.css"

const Pagination = ({ currentPage, totalPages, handlePageChange, pageNumbers }) => {
  return (
    <div className="page-nav">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-nav-btn"
      >
        &lt;
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          disabled={currentPage === pageNumber}
          className="page-nav-btn"
        >
          {pageNumber}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-nav-btn"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
