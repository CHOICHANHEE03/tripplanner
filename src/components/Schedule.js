import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Schedule.css";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSchedules, setAllSchedules] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [view, setView] = useState("all");
  const navigate = useNavigate();

  // 카테고리(유형) 옵션
  const contentTypes = [
    { id: "12", name: "관광지" },
    { id: "14", name: "문화시설" },
    { id: "28", name: "레포츠" },
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setUsername(data.user);
          fetchSchedules();
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

    checkSession();
  }, [navigate]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/schedule");
      if (!response.ok) throw new Error("서버 오류");

      const data = await response.json();

      if (Array.isArray(data)) {
        const processed = processSchedules(data);
        setAllSchedules(processed); // 전체 일정 데이터 저장
        setSchedules(processed);
      } else if (Array.isArray(data.schedules)) {
        const processed = processSchedules(data.schedules);
        setAllSchedules(processed); // 전체 일정 데이터 저장
        setSchedules(processed);
      } else {
        console.error("일정 데이터가 예상과 다릅니다:", data);
        setSchedules([]);
      }
    } catch (error) {
      console.error("일정 데이터 불러오기 오류:", error);
      Swal.fire("오류", "일정 데이터를 불러오는 중 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 일정 데이터에서 카테고리 추출
  const processSchedules = (schedules) => {
    return schedules.map(schedule => {
      const typeLabels = {
        "12": "관광지",
        "14": "문화시설",
        "28": "레포츠"
      };

      // 일정 속 장소의 유형을 배열로 모음
      const scheduleTypes = [
        typeLabels[schedule.type1],
        typeLabels[schedule.type2],
        typeLabels[schedule.type3]
      ].filter(Boolean);

      return {
        ...schedule,
        types: scheduleTypes
      };
    });
  };

  useEffect(() => {
    let filteredSchedules = allSchedules;

    if (view === "mine") {
      filteredSchedules = filteredSchedules.filter(
        (schedule) => schedule.author?.trim() === username?.trim()
      );
    }

    if (selectedType !== "all") {
      filteredSchedules = filteredSchedules.filter((schedule) =>
        schedule.types.includes(
          contentTypes.find((type) => type.id === selectedType)?.name
        )
      );
    }

    setSchedules(filteredSchedules);
  }, [view, selectedType, allSchedules, username]);

  return (
    <div className="schedule-list-container">
      <h2>📅 일정 목록</h2>
      <div className="schedule-view-select">
        <label htmlFor="view-selection">일정 유형: </label>
        <select id="view-selection" value={view} onChange={(e) => setView(e.target.value)}>
          <option value="all">전체 일정 보기</option>
          {isAuthenticated && username && <option value="mine">내 일정 보기</option>}
        </select>
      </div>
      <div className="schedule-view-select">
        <label htmlFor="category-selection">카테고리 선택: </label>
        <select id="category-selection" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="all">전체</option>
          {contentTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <div className="schedule-list-form">
        <div className="schedule-list-form-container">
          {schedules.length === 0 ? (
            <div className="no-schedule">
              <p>등록된 일정이 없습니다.</p>
            </div>
          ) : (
            <div className="schedule-cards-container">
              {schedules.map((schedule) => (
                <div className="schedule-card" key={schedule.id}>
                  <Link to={`/schedule/${schedule.id}`} className="schedule-card-btn">
                    <div className="schedule-card-content">
                      <div className="schedule-card-header">
                        <p><strong>작성자:</strong> {schedule.author}</p>
                        <p className="schedule-date">{schedule.date}</p>
                      </div>
                      <p><strong>제목:</strong> {schedule.title}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="schedule-button-container">
            <button className="add-schedule-button" onClick={() => navigate("/schedule/add")}>
              일정 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;