import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/ScheduleAdd.css";

const ScheduleAdd = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("");
    const [scheduleList, setScheduleList] = useState([{ place: "", details: "" }]);

    const addSchedule = () => {
        if (scheduleList.length >= 3) {
            Swal.fire("알림", "최대 3개의 일정을 추가할 수 있습니다.", "warning");
            return;
        }
        setScheduleList([...scheduleList, { place: "", details: "" }]);
    };

    const updateSchedule = (index, field, value) => {
        const updatedList = [...scheduleList];
        updatedList[index][field] = value;
        setScheduleList(updatedList);
    };

    const handleSubmit = () => {
        if (!title || !date || !type || scheduleList.some(s => !s.place || !s.details)) {
            Swal.fire("오류", "모든 항목을 입력해주세요.", "error");
            return;
        }
        Swal.fire("등록 완료", "일정이 성공적으로 등록되었습니다.", "success");
        navigate("/");
    };

    return (
        <div className="schedule-container">
            <h2 className="schedule-title">🚎 일정 등록</h2>

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
                    type="text"
                    className="schedule-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="schedule-input-container">
                <label htmlFor="type">타입</label>
                <input
                    id="type"
                    type="text"
                    className="schedule-input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
            </div>

            {scheduleList.map((schedule, index) => (
                <div key={index} className="schedule-item">
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