import React from "react";
import "../css/TourismCategory.css";

// 이벤트 카테고리 컴포넌트
const EventCategory = ({
  selectedRegion, // 선택된 지역
  selectedSubCategory, // 선택된 하위 카테고리
  onFilterChange, // 필터 변경 핸들러
}) => {
  // 지역 목록
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

  // 하위 카테고리 목록
  const subCategories = [
    { name: "축제", cat2: "A0207" },
    { name: "공연행사", cat2: "A0208" },
  ];

  return (
    <div className="Tourism-category">
      {/* 지역 필터 버튼 그룹 */}
      <div className="Area-group">
        <button
          className="Area-btn"
          onClick={() => onFilterChange("region", "")} // 전체 선택 버튼
        >
          전체
        </button>
        {regions.map((region) => (
          <button
            key={region.areacode}
            className="Area-btn"
            onClick={() => onFilterChange("region", region.areacode)} // 지역 선택 버튼
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* 하위 카테고리 선택 드롭다운 */}
      <div className="type-group">
        <div className="subCategory-cat">
          <label htmlFor="subCategory">카테고리 선택: </label>
          <select
            id="subCategory"
            value={selectedSubCategory}
            onChange={(e) => onFilterChange("subCategory", e.target.value)}
            className="type-select"
          >
            <option value="">======전체======</option>
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