import React, { useState } from "react";

const Search = ({ onSearch }) => {
    const [filterText, setFilterText] = useState("");

    const handleChange = (event) => {
        const value = event.target.value;
        setFilterText(value);
        onSearch(value);
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={filterText}
                onChange={handleChange}
                className="search-input"
            />
        </div>
    );
};

export default Search;