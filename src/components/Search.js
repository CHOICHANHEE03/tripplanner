import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../css/Search.module.css";

const Search = ({ onSearch, isSchedulePage = false }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        const trimmedTerm = searchTerm.trim();

        if (isSchedulePage) {
            // 정확한 검색어 입력이 필요
            if (trimmedTerm.length > 0) {
                onSearch(trimmedTerm);
            }
        } else {
            // 두 글자 이상 입력 시 검색 실행
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
        <div className={isSchedulePage ? styles.scheduleContainer : styles.container}>
            <div className={isSchedulePage ? styles.scheduleBox : styles.box}>
                <input
                    type="text"
                    className={isSchedulePage ? styles.scheduleInput : styles.input}
                    placeholder={isSchedulePage ? "검색어를 정확히 입력하세요..." : "검색어를 두 글자 이상 입력하세요..."}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className={isSchedulePage ? styles.scheduleButton : styles.button}
                    onClick={handleSearch}
                    disabled={isSchedulePage ? searchTerm.trim().length === 0 : searchTerm.trim().length < 2}
                >
                    <FaSearch />
                </button>
            </div>
        </div>
    );
};

export default Search;