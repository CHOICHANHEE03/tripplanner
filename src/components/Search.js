import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../css/Search.module.css";

// Search 컴포넌트 정의, onSearch 함수와 isSchedulePage 여부를 props로 받음
const Search = ({ onSearch, isSchedulePage = false }) => {
    // 검색어를 관리하는 상태 변수 선언
    const [searchTerm, setSearchTerm] = useState("");

    // 입력값 변경 시 상태 업데이트
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색 버튼 클릭 시 실행되는 함수
    const handleSearch = () => {
        const trimmedTerm = searchTerm.trim(); // 앞뒤 공백 제거

        // isSchedulePage 여부에 따라 검색어 최소 길이 제한을 다르게 적용
        if (isSchedulePage) {
            if (trimmedTerm.length > 0) {
                onSearch(trimmedTerm); // 검색어가 비어 있지 않으면 검색 실행
            }
        } else {
            if (trimmedTerm.length >= 2) {
                onSearch(trimmedTerm); // 일반 페이지에서는 최소 2자 이상 입력해야 검색 실행
            }
        }
    };

    // Enter 키 입력 시 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        // 페이지 유형에 따라 다른 스타일 적용
        <div className={isSchedulePage ? styles.scheduleContainer : styles.container}>
            <div className={isSchedulePage ? styles.scheduleBox : styles.box}>
                <input
                    type="text"
                    className={isSchedulePage ? styles.scheduleInput : styles.input}
                    placeholder={isSchedulePage ? "검색어를 정확히 입력하세요..." : "검색어를 입력하세요..."} // 페이지 유형에 따라 다른 placeholder 표시
                    value={searchTerm}
                    onChange={handleSearchChange} // 입력값 변경 핸들러
                    onKeyPress={handleKeyPress} // Enter 키 입력 핸들러
                />
                <button
                    className={isSchedulePage ? styles.scheduleButton : styles.button}
                    onClick={handleSearch} // 검색 실행
                    disabled={searchTerm.trim().length === 1} // 검색어가 1자만 입력되면 버튼 비활성화
                >
                    <FaSearch /> {/* 검색 아이콘 표시 */}
                </button>
            </div>
        </div>
    );
};

export default Search;