import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/ScheduleModify.css";

const ScheduleAdd = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [username, setUsername] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [types, setTypes] = useState(["", "", ""]);
    const [places, setPlaces] = useState(["", "", ""]);
    const [details, setDetails] = useState(["", "", ""]);
    const [scheduleCount, setScheduleCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const typeMapping = { "관광지": "12", "문화시설": "14", "레포츠": "28" };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/session", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();

                if (data.authenticated) {
                    setUsername(data.user);
                } else {
                    Swal.fire("오류", "로그인이 필요합니다.", "error");
                    navigate("/login");
                }
            } catch (error) {
                console.error("세션 확인 실패:", error);
                Swal.fire("오류", "로그인 확인 중 오류가 발생했습니다.", "error");
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    const fetchFavorites = useCallback(async () => {
        if (!username) return;
        try {
            const response = await fetch(`http://localhost:8080/api/favorites/${username}?page=${currentPage}&size=${itemsPerPage}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error("찜 목록 불러오기 실패");

            const data = await response.json();
            setFavorites(Array.isArray(data.content) ? data.content : []);
        } catch (error) {
            console.error("찜 목록 가져오기 오류:", error);
        }
    }, [username, currentPage]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const addSchedule = () => {
        if (scheduleCount < 3) {
            setScheduleCount(scheduleCount + 1);
        } else {
            Swal.fire("알림", "최대 3개의 일정을 추가할 수 있습니다.", "info");
        }
    };

    const removeSchedule = () => {
        if (scheduleCount > 1) {
            setScheduleCount(scheduleCount - 1);
            setTypes(prev => prev.slice(0, -1));
            setPlaces(prev => prev.slice(0, -1));
            setDetails(prev => prev.slice(0, -1));
        } else {
            Swal.fire("알림", "최소 1개의 일정은 필요합니다.", "info");
        }
    };

    const updateSchedule = (index, field, value) => {
        if (field === "type") {
            const updatedTypes = [...types];
            updatedTypes[index] = typeMapping[value] || "";
            setTypes(updatedTypes);
            console.log("업데이트된 types:", updatedTypes);
        } else if (field === "place") {
            const updatedPlaces = [...places];
            updatedPlaces[index] = value;
            setPlaces(updatedPlaces);
        } else if (field === "details") {
            const updatedDetails = [...details];
            updatedDetails[index] = value;
            setDetails(updatedDetails);
        }
    };

    const getFilteredFavorites = (index) => {
        console.log("필터링 전 favorites:", favorites);
        console.log(`현재 index: ${index}, 선택된 타입: ${types[index]}`);

        if (!types[index]) return [];

        const filtered = favorites.filter(place => {
            const contentTypeId = place.tourism?.contentTypeId?.toString(); // 문자열 변환
            return contentTypeId === types[index];
        });

        console.log("필터링 후:", filtered);
        return filtered;
    };

    const handleSubmit = async () => {
        if (!title || !date || types.every(t => !t) || places.every(p => !p) || details.every(d => !d)) {
            Swal.fire("오류", "모든 항목을 입력해주세요.", "error");
            return;
        }

        const scheduleData = {
            title,
            date,
            author: username, // 작성자 필드 추가
            type1: types[0],
            place1: places[0],
            details1: details[0],
            type2: types[1],
            place2: places[1],
            details2: details[1],
            type3: types[2],
            place3: places[2],
            details3: details[2]
        };

        try {
            const response = await fetch("http://localhost:8080/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(scheduleData)
            });

            if (!response.ok) throw new Error("서버 요청에 실패했습니다.");

            Swal.fire("등록 완료", "일정이 성공적으로 등록되었습니다.", "success");
            navigate("/schedule");
        } catch (error) {
            Swal.fire("오류", "서버 요청에 실패했습니다.", "error");
            console.error("Error submitting schedule:", error);
        }
    };

    return (
        <div className="add-container">
            <h2 className="add-title">🚎 일정 등록</h2>
            <div className="schedule-button-container">
                <button onClick={addSchedule} className="schedule-button">일정 추가</button>
                <button onClick={removeSchedule} className="schedule-button">일정 삭제</button>
            </div>
            <div className="schedule-input-container">
                <label htmlFor="title">제목</label>
                <input id="title" type="text" className="schedule-input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="schedule-input-container">
                <label htmlFor="date">여행 날짜</label>
                <input id="date" type="date" className="schedule-input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            {[...Array(scheduleCount)].map((_, index) => (
                <div key={index} className="add-item">
                    <div className="schedule-input-container">
                        <label>타입 {index + 1}</label>
                        <select className="schedule-input" onChange={(e) => updateSchedule(index, "type", e.target.value)}>
                            <option value="">선택하세요</option>
                            {Object.keys(typeMapping).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>

                    <div className="schedule-input-container">
                        <label>찜한 목록 {index + 1}</label>
                        <select className="schedule-input" onChange={(e) => updateSchedule(index, "place", e.target.value)}>
                            <option value="">선택하세요</option>
                            {getFilteredFavorites(index).map(place => (
                                <option key={place.id} value={place.tourism?.title || '기타'}>
                                    {place.tourism?.title || '기타'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="schedule-input-container">
                        <label>내용</label>
                        <input type="text" className="schedule-input" value={details[index]} onChange={(e) => updateSchedule(index, "details", e.target.value)} />
                    </div>
                </div>
            ))}
            <button onClick={handleSubmit} className="schedule-button">일정 등록하기</button>
        </div>
    );
};

export default ScheduleAdd;
