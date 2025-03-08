import React from "react";
import "../Info.css";

const EventInfo = () => {
    return (
        <div class="info-section">
            <h2>최신 행사 정보</h2>
            <div className="info-container">
                <div className="info-box"></div>
                <div className="info-box"></div>
                <div className="info-box"></div>
            </div>
            <p class="info-text">더 많은 정보를 보시겠습니까?&nbsp;&nbsp;&nbsp;
                <button className="info-button">행사 바로가기</button>
            </p>
        </div>
    );
};

export default EventInfo;