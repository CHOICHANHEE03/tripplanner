import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import "../css/ScheduleDetail.css";

const ScheduleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scheduleData, setScheduleData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/schedule/${id}`);
                if (!response.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();

                const typeLabels = {
                    "1": "관광지",
                    "2": "문화시설",
                    "3": "레포츠"
                };

                const scheduleItems = [
                    { place: data.place1, details: data.details1, type: typeLabels[data.type1] || "알 수 없음" },
                    { place: data.place2, details: data.details2, type: typeLabels[data.type2] || "알 수 없음" },
                    { place: data.place3, details: data.details3, type: typeLabels[data.type3] || "알 수 없음" }
                ].filter(item => item.place && item.details);

                setScheduleData({
                    id: data.id,
                    title: data.title,
                    date: data.date,
                    scheduleItems
                });
            } catch (error) {
                console.error("데이터를 불러오는 중 오류 발생:", error);
                setScheduleData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleData();
    }, [id]);

    if (loading) {
        return <p>데이터를 불러오는 중...</p>;
    }

    if (!scheduleData) {
        return <p>해당 일정 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="schedule-detail-container">
            <div className="schedule-back-button" onClick={() => navigate(-1)}>
                <IoCaretBackCircle size={32} />
            </div>

            <h2 className="schedule-detail-title">{scheduleData.title}</h2>
            <p><strong>날짜:</strong> {scheduleData.date}</p>

            {scheduleData.scheduleItems.length > 0 && (
                <div>
                    <h3>📍 일정 목록</h3>
                    <ul>
                        {scheduleData.scheduleItems.map((item, index) => (
                            <li key={index}>
                                <p><strong>유형:</strong> {item.type}</p>
                                <p><strong>장소:</strong> {item.place}</p>
                                <p><strong>내용:</strong> {item.details}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ScheduleDetail;