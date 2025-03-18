import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import Search from "./Search";
import "../css/ScheduleModify.css";

const ScheduleAdd = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 hook

    // 일정 관련 상태 변수
    const [title, setTitle] = useState(""); // 일정 제목
    const [date, setDate] = useState(""); // 일정 날짜
    const [username, setUsername] = useState(""); // 사용자 이름
    const [types, setTypes] = useState(["", "", ""]); // 장소 타입
    const [places, setPlaces] = useState(["", "", ""]); // 장소명
    const [details, setDetails] = useState(["", "", ""]); // 상세 설명
    const [scheduleCount, setScheduleCount] = useState(1); // 일정 개수

    // 타입 매핑 (코드 → 명칭)
    const typeMapping = { "12": "관광지", "14": "문화시설", "28": "레포츠" };
    // 타입 매핑 (명칭 → 코드)
    const reverseTypeMapping = { "관광지": "12", "문화시설": "14", "레포츠": "28" };

    // 사용자 로그인 확인
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
                Swal.fire("오류", "로그인 확인 중 오류가 발생했습니다.", "error");
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    // 관광지 및 행사 검색 함수
    const fetchTourism = async (searchTerm, index) => {
        if (!searchTerm) return;
        try {
            // 관광지 검색
            const tourismResponse = await fetch("http://localhost:8080/api/tourism");
            if (!tourismResponse.ok) throw new Error("관광지 검색 실패");
            const tourismData = await tourismResponse.json();

            let foundItem = tourismData.content.find(item =>
                item.title.toLowerCase() === searchTerm.toLowerCase()
            );

            if (foundItem) {
                updateScheduleFields(index, foundItem.title, typeMapping[foundItem.contentTypeId] || "기타");
                return;
            }

            // 행사 검색
            const eventResponse = await fetch("http://localhost:8080/api/event");
            if (!eventResponse.ok) throw new Error("행사 검색 실패");
            const eventData = await eventResponse.json();

            foundItem = eventData.content.find(item =>
                item.title.toLowerCase() === searchTerm.toLowerCase()
            );

            if (foundItem) {
                updateScheduleFields(index, foundItem.title, "행사");
                return;
            }

            Swal.fire("검색 실패", "일치하는 관광지나 행사가 없습니다.", "warning");
        } catch (error) {
            Swal.fire("오류", "검색 중 문제가 발생했습니다.", "error");
        }
    };

    // 일정 필드 업데이트 함수
    const updateScheduleFields = (index, place, type) => {
        const updatedPlaces = [...places];
        updatedPlaces[index] = place;
        setPlaces(updatedPlaces);

        const updatedTypes = [...types];
        updatedTypes[index] = type;
        setTypes(updatedTypes);
    };

    // 일정 추가
    const addSchedule = () => {
        if (scheduleCount < 3) {
            setScheduleCount(scheduleCount + 1);
        } else {
            Swal.fire("알림", "최대 3개의 일정을 추가할 수 있습니다.", "info");
        }
    };

    // 일정 삭제
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

    // 일정 등록 함수
    const handleSubmit = async () => {
        if (!title || !date || places.every(p => !p) || details.every(d => !d)) {
            Swal.fire("오류", "모든 항목을 입력해주세요.", "error");
            return;
        }

        const scheduleData = {
            title,
            date,
            username,
            type1: types[0] === "행사" ? "0" : reverseTypeMapping[types[0]] || "",
            place1: places[0],
            details1: details[0],
            type2: types[1] === "행사" ? "0" : reverseTypeMapping[types[1]] || "",
            place2: places[1],
            details2: details[1],
            type3: types[2] === "행사" ? "0" : reverseTypeMapping[types[2]] || "",
            place3: places[2],
            details3: details[2]
        };

        try {
            const response = await fetch("http://localhost:8080/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(scheduleData)
            });

            if (!response.ok) throw new Error("서버 요청 실패");

            Swal.fire("등록 완료", "일정이 성공적으로 등록되었습니다.", "success");
            navigate("/schedule");
        } catch (error) {
            Swal.fire("오류", "서버 요청 실패", "error");
        }
    };

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.querySelector("input[type='date']").min = formattedDate;

    return (
        <div className="add-container">
            <div className="schedule-back-button" onClick={() => navigate(-1)}>
                <IoCaretBackCircle size={32} />
            </div>
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
                    <Search isSchedulePage={true} onSearch={(searchTerm) => fetchTourism(searchTerm, index)} />
                    <div className="schedule-input-container">
                        <label>타입</label>
                        <input type="text" className="schedule-input" value={types[index]} disabled />
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
            <button onClick={handleSubmit} className="schedule-button">일정 등록하기</button>
        </div>
    );
};

export default ScheduleAdd;