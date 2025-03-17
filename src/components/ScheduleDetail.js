import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import Swal from "sweetalert2";
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
                    "12": "관광지",
                    "14": "문화시설",
                    "28": "레포츠"
                };

                const scheduleItems = [
                    { place: data.place1, details: data.details1, type: data.type1 },
                    { place: data.place2, details: data.details2, type: data.type2 },
                    { place: data.place3, details: data.details3, type: data.type3 }
                ].filter(item => item.place && item.details);

                const updatedScheduleItems = await Promise.all(scheduleItems.map(async (item) => {
                    const tourismData = await fetchTourismData(item.place);
                    return {
                        ...item,
                        type: typeLabels[item.type] || "알 수 없음",
                        imageUrl: tourismData.imageUrl,
                        address: tourismData.address,
                        tel: tourismData.tel
                    };
                }));

                setScheduleData({
                    id: data.id,
                    title: data.title,
                    date: data.date,
                    username: data.username,
                    scheduleItems: updatedScheduleItems
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

    const fetchTourismData = async (place) => {
        try {
            const response = await fetch("http://localhost:8080/api/tourism");
            if (!response.ok) throw new Error("관광지 데이터 검색 실패");

            const data = await response.json();
            const match = data.content.find(item => item.title === place);

            return match ? {
                imageUrl: match.firstimage || "",
                address: match.addr1 || "정보 없음",
                tel: match.tel && match.tel !== "null" ? match.tel : "정보 없음"
            } : { imageUrl: "", address: "정보 없음", phone: "정보 없음" };
        } catch (error) {
            console.error("관광지 데이터 검색 오류:", error);
            return { imageUrl: "", address: "정보 없음", phone: "정보 없음" };
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8080/api/schedule/${id}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) {
                        throw new Error("삭제에 실패했습니다.");
                    }
                    Swal.fire("삭제 완료!", "일정이 삭제되었습니다.", "success").then(() => {
                        navigate("/");
                    });
                } catch (error) {
                    console.error("삭제 중 오류 발생:", error);
                    Swal.fire("오류", "삭제 중 문제가 발생했습니다.", "error");
                }
            }
        });
    };

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
            <p><strong>작성자:</strong> {scheduleData.username}</p>

            {scheduleData.scheduleItems.length > 0 && (
                <div>
                    <h3>📍 일정 내용</h3>
                    <ul>
                        {scheduleData.scheduleItems.map((item, index) => (
                            <li key={index} className="schedule-item">
                                {item.imageUrl && <img src={item.imageUrl} alt={item.place} className="schedule-image" />}
                                <p><strong>유형:</strong> {item.type}</p>
                                <p><strong>장소:</strong> {item.place}</p>
                                <p><strong>내용:</strong> {item.details}</p>
                                <p><strong>주소:</strong> {item.address}</p>
                                {item.tel && item.tel !== "정보 없음" && <p><strong>전화번호:</strong> {item.tel}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="schedule-detail-buttons">
                <button onClick={() => navigate(`/schedule/edit/${scheduleData.id}`)} className="schedule-detail-button">수정하기</button>
                <button onClick={handleDelete} className="schedule-detail-button">삭제하기</button>
            </div>
        </div>
    );
};

export default ScheduleDetail;