import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Schedule.css";
import Swal from "sweetalert2";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedType, setSelectedType] = useState("all");
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
        setSchedules(processSchedules(data));
      } else if (Array.isArray(data.schedules)) {
        setSchedules(processSchedules(data.schedules));
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

  // 선택한 카테고리에 따라 일정 필터링
  const filteredSchedules = selectedType === "all"
    ? schedules
    : schedules.filter(schedule => schedule.types.includes(contentTypes.find(type => type.id === selectedType)?.name));

  if (loading) {
    return <p>일정을 불러오는 중...</p>;
  }

  return (
    <div className="schedule-container">
      <h2>📅 일정 목록</h2>

      {/* 카테고리 선택 필터 */}
      <div className="filter-section">
        <label>카테고리 선택: </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">전체</option>
          {contentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {filteredSchedules.length === 0 ? (
        <p>등록된 일정이 없습니다.</p>
      ) : (
        <ul>
          {filteredSchedules.map((schedule) => (
            <li key={schedule.id} className="schedule-item">
              <Link to={`/schedule/${schedule.id}`}>
                <div className="schedule-info">
                  <p><strong>작성자:</strong> {username}</p>
                  <p><strong>제목:</strong> {schedule.title}</p>
                </div>
                <p className="schedule-date">{schedule.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <button className="add-schedule-button" onClick={() => navigate("/schedule/add")}>
        일정 추가
      </button>
    </div>
  );
};

export default Schedule;