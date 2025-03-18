import React from "react";
import "../css/TourismCategory.css";

// 관광 카테고리를 선택하는 컴포넌트
const TourismCategory = ({
  selectedRegion, // 선택된 지역 코드
  selectedType, // 선택된 관광지 타입 코드
  selectedSubCategory, // 선택된 세부 카테고리 코드
  onFilterChange, // 필터 변경 시 호출되는 함수
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

  // 관광지 타입 목록
  const tourismTypes = [
    { contenttypeid: "12", name: "관광지" },
    { contenttypeid: "14", name: "문화시설" },
    { contenttypeid: "28", name: "레포츠" },
  ];

  // 관광지 타입에 따른 세부 카테고리 목록
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
      {/* 지역 필터 버튼 그룹 */}
      <div className="Area-group">
        <button
          className="Area-btn"
          onClick={() => onFilterChange("region", "")} // 전체 선택 시 지역 필터 해제
        >
          전체
        </button>
        {regions.map((region) => (
          <button
            key={region.areacode}
            className="Area-btn"
            onClick={() => onFilterChange("region", region.areacode)} // 지역 선택 시 필터 변경
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* 관광 타입 및 세부 카테고리 필터 */}
      <div className="type-group">
        {/* 관광 타입 선택 드롭다운 */}
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

        {/* 세부 카테고리 선택 드롭다운 */}
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