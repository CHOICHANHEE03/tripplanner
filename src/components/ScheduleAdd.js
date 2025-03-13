import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/ScheduleAdd.css";

const ScheduleAdd = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [typeList, setTypeList] = useState([{ type: "" }]);
    const [scheduleList, setScheduleList] = useState([{ place: "", details: "" }]);
    const [username, setUsername] = useState("");

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

    const addSchedule = () => {
        if (scheduleList.length >= 3) {
            Swal.fire("알림", "최대 3개의 일정을 추가할 수 있습니다.", "warning");
            return;
        }
        setScheduleList([...scheduleList, { place: "", details: "" }]);
        setTypeList([...typeList, { type: "" }]);
    };

    const updateSchedule = (index, field, value) => {
        const updatedList = [...scheduleList];
        updatedList[index][field] = value;
        setScheduleList(updatedList);
    };

    const updateType = (index, value) => {
        const typeMapping = {
            "관광지": 1,
            "문화시설": 2,
            "레포츠": 3
        };

        const updatedList = [...typeList];
        updatedList[index].type = typeMapping[value] || "";
        setTypeList(updatedList);
    };

    const handleSubmit = async () => {
        if (!title || !date || typeList.some(t => !t.type) || scheduleList.some(s => !s.place || !s.details)) {
            Swal.fire("오류", "모든 항목을 입력해주세요.", "error");
            return;
        }

        const scheduleData = {
            title,
            date,
            username,
            typeList: typeList.map(t => t.type).join(","), // 배열을 쉼표로 구분된 문자열로 변환
            scheduleList
        };

        try {
            const response = await fetch("http://localhost:8080/api/schedule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(scheduleData)
            });

            if (!response.ok) {
                throw new Error("서버 요청에 실패했습니다.");
            }

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
            <div className="schedule-input-container">
                <label htmlFor="title">제목</label>
                <input
                    id="title"
                    type="text"
                    className="schedule-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="schedule-input-container">
                <label htmlFor="date">여행 날짜</label>
                <input
                    id="date"
                    type="date"
                    className="schedule-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {scheduleList.map((schedule, index) => (
                <div key={index} className="add-item">
                    <div className="schedule-input-container">
                        <label htmlFor={`type-${index}`}>타입 {index + 1}</label>
                        <select
                            id={`type-${index}`}
                            className="schedule-input"
                            value={typeList[index].type ?
                                (typeList[index].type === 1 ? "관광지" : typeList[index].type === 2 ? "문화시설" : "레포츠")
                                : ""}
                            onChange={(e) => updateType(index, e.target.value)}
                        >
                            <option value="">선택하세요</option>
                            <option value="관광지">관광지</option>
                            <option value="문화시설">문화시설</option>
                            <option value="레포츠">레포츠</option>
                        </select>
                    </div>

                    <div className="schedule-input-container">
                        <label htmlFor={`place-${index}`}>찜한 목록 {index + 1}</label>
                        <input
                            id={`place-${index}`}
                            type="text"
                            className="schedule-input"
                            value={schedule.place}
                            onChange={(e) => updateSchedule(index, "place", e.target.value)}
                        />
                    </div>

                    <div className="schedule-input-container">
                        <label htmlFor={`details-${index}`}>내용</label>
                        <input
                            id={`details-${index}`}
                            type="text"
                            className="schedule-input"
                            value={schedule.details}
                            onChange={(e) => updateSchedule(index, "details", e.target.value)}
                        />
                    </div>
                </div>
            ))}

            <div className="schedule-button-container">
                <button onClick={addSchedule} className="schedule-button">일정 추가</button>
                <button onClick={handleSubmit} className="schedule-button">일정 등록하기</button>
            </div>
        </div>
    );
};

export default ScheduleAdd;