import React from "react";
import "../css/TourismCategory.css";

const EventCategory = ({
  selectedRegion,
  selectedSubCategory,
  onFilterChange,
}) => {
  const regions = [
    { name: "서울", areacode: "1" },
    { name: "인천", areacode: "2" },
    { name: "대전", areacode: "3" },
    { name: "대구", areacode: "4" },
    { name: "광주", areacode: "5" },
    { name: "부산", areacode: "6" },
    { name: "울산", areacode: "7" },
    { name: "세종", areacode: "8" },
    { name: "경기", areacode: "31" },
    { name: "강원", areacode: "32" },
    { name: "충북", areacode: "33" },
    { name: "충남", areacode: "34" },
    { name: "경북", areacode: "35" },
    { name: "경남", areacode: "36" },
    { name: "전북", areacode: "37" },
    { name: "전라", areacode: "38" },
    { name: "제주", areacode: "39" },
  ];

  const subCategories = [
    { name: "축제", cat2: "A0207" },
    { name: "공연행사", cat2: "A0208" },
  ];

  return (
    <div className="Tourism-category">
      <div className="Area-group">
        <button
          className="Area-btn"
          onClick={() => onFilterChange("region", "")}
        >
          전체
        </button>
        {regions.map((region) => (
          <button
            key={region.areacode}
            className="Area-btn"
            onClick={() => onFilterChange("region", region.areacode)}
          >
            {region.name}
          </button>
        ))}
      </div>
      <div className="type-group">
        <div className="subCategory-cat">
          <label htmlFor="subCategory">카테고리 선택: </label>
          <select
            id="subCategory"
            value={selectedSubCategory}
            onChange={(e) => onFilterChange("subCategory", e.target.value)}
            className="type-select"
          >
            <option value="">전체</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.cat2} value={subCategory.cat2}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventCategory;