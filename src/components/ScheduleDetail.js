import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/TourismDetail.css";

const TourismDetail = () => {
    const { id } = useParams(); // URL에서 id 값 가져오기
    const [tourismData, setTourismData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 예제 데이터 (실제로는 API 호출 또는 상태 관리에서 가져올 수 있음)
        const fetchTourismData = async () => {
            try {
                // 백엔드 API 또는 로컬 데이터를 불러오는 부분
                const response = await fetch(`/api/tourism/${id}`); // 백엔드 API 호출 예제
                const data = await response.json();
                setTourismData(data);
            } catch (error) {
                console.error("데이터를 불러오는 중 오류 발생:", error);
                setTourismData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTourismData();
    }, [id]); // id 값이 변경될 때마다 실행

    if (loading) {
        return <p>데이터를 불러오는 중...</p>;
    }

    if (!tourismData) {
        return <p>해당 관광지 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="tourism-detail-container">
            <h2 className="tourism-detail-title">{tourismData.name}</h2>
            <p><strong>위치:</strong> {tourismData.location}</p>
            <p><strong>설명:</strong> {tourismData.description}</p>
            <img src={tourismData.image} alt={tourismData.name} className="tourism-detail-image" />
        </div>
    );
};

export default TourismDetail;