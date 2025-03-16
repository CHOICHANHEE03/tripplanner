import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/ScheduleModify.css";

const ScheduleEdit = () => {
    const navigate = useNavigate();
    const { scheduleId } = useParams();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [username, setUsername] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [types, setTypes] = useState(["", "", ""]);
    const [places, setPlaces] = useState(["", "", ""]);
    const [details, setDetails] = useState(["", "", ""]);
    const [scheduleCount, setScheduleCount] = useState(1);

    const typeMapping = { "관광지": "12", "문화시설": "14", "레포츠": "28" };

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/schedule/${scheduleId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("일정 불러오기 실패");

                const data = await response.json();
                const typeLabels = { "12": "관광지", "14": "문화시설", "28": "레포츠" };

                setTitle(data.title);
                setDate(data.date);
                setUsername(data.author);
                setTypes([
                    typeLabels[data.type1] || "",
                    typeLabels[data.type2] || "",
                    typeLabels[data.type3] || ""
                ]);
                setPlaces([data.place1, data.place2, data.place3]);
                setDetails([data.details1, data.details2, data.details3]);
                setScheduleCount(data.type3 ? 3 : data.type2 ? 2 : 1);
            } catch (error) {
                console.error("일정 가져오기 오류:", error);
                Swal.fire("오류", "일정 정보를 불러오는 중 오류가 발생했습니다.", "error");
            }
        };
        fetchSchedule();
    }, [scheduleId]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:8080/favorites/${username}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("찜 목록 불러오기 실패");
                const data = await response.json();
                setFavorites(data.content || []);
            } catch (error) {
                console.error("찜 목록 가져오기 오류:", error);
            }
        };
        if (username) fetchFavorites();
    }, [username]);

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

    const getFilteredFavorites = (index) => {
        if (!types[index]) return [];
        return favorites.filter(place => place.tourism?.contentTypeId?.toString() === typeMapping[types[index]]);
    };

    const handleSubmit = async () => {
        if (!title || !date || types.every(t => !t) || places.every(p => !p) || details.every(d => !d)) {
            Swal.fire("오류", "모든 항목을 입력해주세요.", "error");
            return;
        }

        const scheduleData = {
            title,
            date,
            author: username,
            type1: typeMapping[types[0]] || "",
            place1: places[0],
            details1: details[0],
            type2: typeMapping[types[1]] || "",
            place2: places[1],
            details2: details[1],
            type3: typeMapping[types[2]] || "",
            place3: places[2],
            details3: details[2],
        };

        try {
            const response = await fetch(`http://localhost:8080/api/schedule/${scheduleId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(scheduleData),
            });

            if (!response.ok) throw new Error("서버 요청 실패");

            Swal.fire("수정 완료", "일정이 성공적으로 수정되었습니다.", "success");
            navigate("/schedule");
        } catch (error) {
            Swal.fire("오류", "서버 요청 실패", "error");
            console.error("Error updating schedule:", error);
        }
    };

    return (
        <div className="add-container">
            <h2 className="add-title">✏️ 일정 수정</h2>
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
                        <select className="schedule-input" value={types[index]} onChange={(e) => {
                            const updatedTypes = [...types];
                            updatedTypes[index] = e.target.value;
                            setTypes(updatedTypes);
                        }}>
                            <option value="">선택하세요</option>
                            {Object.keys(typeMapping).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    </div>
                    <div className="schedule-input-container">
                        <label>찜한 목록 {index + 1}</label>
                        <select className="schedule-input" value={places[index]} onChange={(e) => {
                            const updatedPlaces = [...places];
                            updatedPlaces[index] = e.target.value;
                            setPlaces(updatedPlaces);
                        }}>
                            <option value="">선택하세요</option>
                            {getFilteredFavorites(index).map(place => (
                                <option key={place.id} value={place.tourism?.title}>{place.tourism?.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="schedule-input-container">
                        <label>내용</label>
                        <input type="text" className="schedule-input" value={details[index]} onChange={(e) => {
                            const updatedDetails = [...details];
                            updatedDetails[index] = e.target.value;
                            setDetails(updatedDetails);
                        }} />
                    </div>
                </div>
            ))}
            <div className="schedule-button-container">
                <button onClick={handleSubmit} className="schedule-button">일정 수정하기</button>
            </div>
        </div>
    );
};

export default ScheduleEdit;