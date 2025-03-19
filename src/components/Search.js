import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../css/Search.module.css";

// Search 컴포넌트 정의, onSearch 함수와 isSchedulePage 여부를 props로 받음
const Search = ({ onSearch, isSchedulePage = false }) => {
    // 검색어를 관리하는 상태 변수 선언
    const [searchTerm, setSearchTerm] = useState("");
    const [prevTerm, setPrevTerm] = useState("");

    // 입력값 변경 시 상태 업데이트
    const handleSearchChange = (e) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm);
        const trimmedTerm = newTerm.trim();

        // 입력값이 삭제되었을 때 즉시 검색 실행
        if (prevTerm.length > 0 && trimmedTerm.length === 0) {
            onSearch("");
        }

        setPrevTerm(trimmedTerm);
    };

    const handleSearch = () => {
        const trimmedTerm = searchTerm.trim();
        if (isSchedulePage) {
            if (trimmedTerm.length > 0) {
                onSearch(trimmedTerm);
            }
        } else {
            if (trimmedTerm.length >= 2) {
                onSearch(trimmedTerm);
            }
        }
    };

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
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
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