import React from "react";
import "../css/TourismCategory.css";

const TourismCategory = ({
  selectedRegion,
  selectedType,
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

  const tourismTypes = [
    { contenttypeid: "12", name: "관광지" },
    { contenttypeid: "14", name: "문화시설" },
    { contenttypeid: "28", name: "레포츠" },
  ];

  const subCategories = {
    12: [
      { name: "자연관광지", cat2: "A0101" },
      { name: "관광자원", cat2: "A0102" },
    ],
    14: [
      { name: "역사관광지", cat2: "A0201" },
      { name: "휴양관광지", cat2: "A0202" },
      { name: "체험관광지", cat2: "A0203" },
      { name: "건축/조형물", cat2: "A0205" },
      { name: "문화시설", cat2: "A0206" },
    ],
    28: [
      { name: "레포츠소개", cat2: "A0301" },
      { name: "육상 레포츠", cat2: "A0302" },
      { name: "수상 레포츠", cat2: "A0303" },
      { name: "항공 레포츠", cat2: "A0304" },
      { name: "복합 레포츠", cat2: "A0305" },
    ],
  };

  return (
    <div className="Tourism-category">
      <div className="Area-group">
        <button
          className="Area-btn"
          onClick={() => onFilterChange("region", "")} // 필터 변경 시 호출
        >
          전체
        </button>
        {regions.map((region) => (
          <button
            key={region.areacode}
            className="Area-btn"
            onClick={() => onFilterChange("region", region.areacode)} // 지역 필터 변경
          >
            {region.name}
          </button>
        ))}
      </div>
      <div className="type-group">
        <div className="tourismType-cat">
          <label htmlFor="tourismType">관광지 타입 선택: </label>
          <select
            id="tourismType"
            value={selectedType}
            onChange={(e) => onFilterChange("tourismType", e.target.value)} // 관광지 타입 필터 변경
            className="type-select"
          >
            <option value="">======전체======</option>
            {tourismTypes.map((tourismType) => (
              <option
                key={tourismType.contenttypeid}
                value={tourismType.contenttypeid}
              >
                {tourismType.name}
              </option>
            ))}
          </select>
        </div>

        <div className="subCategory-cat">
          <label htmlFor="subCategory">세부 카테고리 선택: </label>
          <select
            id="subCategory"
            value={selectedSubCategory}
            onChange={(e) => onFilterChange("subCategory", e.target.value)} // 세부 카테고리 필터 변경
            className="type-select"
          >
            <option value="">======전체======</option>
            {selectedType &&
              subCategories[selectedType] &&
              subCategories[selectedType].map((subCategory) => (
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

export default TourismCategory;
