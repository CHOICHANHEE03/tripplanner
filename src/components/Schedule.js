import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Schedule.css";
import Swal from "sweetalert2";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

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
          setUsername(data.user); // username 저장
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
        setSchedules(data);
      } else if (Array.isArray(data.schedules)) {
        setSchedules(data.schedules);
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

  if (loading) {
    return <p>일정을 불러오는 중...</p>;
  }

  return (
    <div className="schedule-container">
      <h2>📅 일정 목록</h2>
      {schedules.length === 0 ? (
        <p>등록된 일정이 없습니다.</p>
      ) : (
        <ul>
          {schedules.map((schedule) => (
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
      <button className="add-schedule-button" onClick={() => navigate("/schedule/add")}>일정 추가</button>
    </div>
  );
};

export default Schedule;