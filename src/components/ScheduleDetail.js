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
                const typeList = data.typeList ? data.typeList.split(',').map(Number) : [];
                
                setScheduleData({
                    id: data.id,
                    title: data.title,
                    date: data.date,
                    typeList,
                    scheduleItems: data.scheduleItems || []
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

    const typeLabels = ["알 수 없음", "관광지", "문화시설", "레포츠"];

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
                            <li key={item.id}>
                                <p><strong>유형:</strong> {typeLabels[scheduleData.typeList[index]] || "알 수 없음"}</p>
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