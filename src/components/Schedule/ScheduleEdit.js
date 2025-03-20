import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import SearchTerm from "../Function/SearchTerm";
import "../../css/Schedule/ScheduleModify.css";

const ScheduleEdit = () => {
    const navigate = useNavigate();
    const { scheduleId } = useParams(); // URL에서 scheduleId를 가져옴

    // 일정 관련 상태 변수
    const [title, setTitle] = useState(""); // 일정 제목
    const [date, setDate] = useState(""); // 일정 날짜
    const [username, setUsername] = useState(""); // 사용자 이름
    const [types, setTypes] = useState(["", "", ""]); // 장소 타입
    const [places, setPlaces] = useState(["", "", ""]); // 장소명
    const [details, setDetails] = useState(["", "", ""]); // 상세 설명
    const [scheduleCount, setScheduleCount] = useState(1); // 일정 개수
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // 타입 매핑 (코드 → 명칭)
    const typeMapping = { "12": "관광지", "14": "문화시설", "28": "레포츠" };
    // 타입 매핑 (명칭 → 코드)
    const reverseTypeMapping = { "관광지": "12", "문화시설": "14", "레포츠": "28" };

    // 일정 정보를 불러오는 useEffect
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8080/api/schedule/${scheduleId}`, { // JWT가 적용된 URL로 변경
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setTitle(data.title);
                setDate(data.date);
                setUsername(data.username);
                setTypes([
                    typeMapping[data.type1] || "",
                    typeMapping[data.type2] || "",
                    typeMapping[data.type3] || ""
                ]);
                setPlaces([data.place1, data.place2, data.place3]);
                setDetails([data.details1, data.details2, data.details3]);
                setScheduleCount(data.type3 ? 3 : data.type2 ? 2 : 1);
            } catch (error) {
                Swal.fire("오류", "일정 정보를 불러오는 중 오류가 발생했습니다.", "error");
            }
        };
        fetchSchedule();
    }, [scheduleId]);

    // 관광지 및 행사 검색 함수
    const fetchTourism = async (searchTerm, index) => {
        if (!searchTerm) return;
        try {
            const token = localStorage.getItem("token");

            // URLSearchParams를 사용하여 쿼리 파라미터 생성
            const params = new URLSearchParams();
            if (searchTerm.trim().length > 0) params.append("search", searchTerm);
            params.append("page", currentPage - 1);
            params.append("size", itemsPerPage);

            // 관광지 및 행사 데이터 동시 요청 (검색어 포함)
            const [tourismResponse, eventResponse] = await Promise.all([
                fetch(`http://localhost:8080/api/tourism?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch(`http://localhost:8080/api/event?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
            ]);

            const [tourismData, eventData] = await Promise.all([
                tourismResponse.json(),
                eventResponse.json()
            ]);

            // 검색된 데이터에서 첫 번째 항목 선택
            let foundItem = tourismData?.data?.length > 0 ? tourismData.data[0] : null;

            if (foundItem) {
                updateScheduleFields(index, foundItem.title, typeMapping[foundItem.contentTypeId] || "기타");
                return;
            }

            // 관광지에서 찾지 못한 경우, 행사 데이터에서 검색
            foundItem = eventData?.data?.length > 0 ? eventData.data[0] : null;

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

    // 일정 수정
    const handleSubmit = async () => {
        if (!title || !date || places.every(p => !p) || details.every(d => !d)) {
            Swal.fire("알림", "모든 항목을 입력해주세요.", "info");
            return;
        }

        if (title.length > 15) {
            Swal.fire("알림", "제목을 15자 이하로 작성해 주세요.", "info");
            return;
        }

        const scheduleData = {
            title,
            date,
            username,
            type1: types[0] === "행사" ? "0" : reverseTypeMapping[types[0]] || "",
            place1: places[0] || "",
            details1: details[0] || "",
            type2: scheduleCount > 1 ? (types[1] === "행사" ? "0" : reverseTypeMapping[types[1]] || "") : "",
            place2: scheduleCount > 1 ? places[1] || "" : "",
            details2: scheduleCount > 1 ? details[1] || "" : "",
            type3: scheduleCount > 2 ? (types[2] === "행사" ? "0" : reverseTypeMapping[types[2]] || "") : "",
            place3: scheduleCount > 2 ? places[2] || "" : "",
            details3: scheduleCount > 2 ? details[2] || "" : "",
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8080/api/schedule/${scheduleId}", { // JWT가 적용된 URL로 변경
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(scheduleData)
            });

            if (!response.ok) throw new Error("서버 요청 실패");

            Swal.fire("수정 완료", "일정이 성공적으로 수정되었습니다.", "success");
            navigate("/schedule");
        } catch (error) {
            Swal.fire("오류", "서버 요청 실패", "error");
        }
    };

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    useEffect(() => {
        if (date && date < formattedDate) {
            setDate(formattedDate); // 과거 날짜 선택 방지
        }
    }, [date, formattedDate]);

    return (
        <div className="add-container">
            <div className="schedule-back-button" onClick={() => navigate(-1)}>
                <IoCaretBackCircle size={32} />
            </div>
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
                <input id="date" type="date" className="schedule-input" value={date} onChange={(e) => setDate(e.target.value)} min={formattedDate} />
            </div>
            {[...Array(scheduleCount)].map((_, index) => (
                <div key={index} className="add-item">
                    <SearchTerm
                        isSchedulePage={true}
                        onSearch={(searchTerm) => fetchTourism(searchTerm, index)}
                    />
                    <p className="schedule-info-text">🔍관광지 및 행사명을 검색하세요</p>
                    <div className="schedule-input-container">
                        <label>타입</label>
                        <input type="text" className="schedule-input" value={types[index]} disabled />
                    </div>
                    <div className="schedule-input-container">
                        <label>내용</label>
                        <textarea className="schedule-inputarea" value={details[index]}
                            spellCheck="false" rows="5" cols="50" onChange={(e) => {
                                const updatedDetails = [...details];
                                updatedDetails[index] = e.target.value;
                                setDetails(updatedDetails);
                            }} />
                    </div>
                </div>
            ))}
            <button onClick={handleSubmit} className="schedule-button">일정 수정하기</button>
        </div>
    );
};

export default ScheduleEdit;