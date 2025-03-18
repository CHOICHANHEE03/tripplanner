import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import logo from "../image/logo.png";
import "../css/LoginJoin.css";

const Login = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수
  const [username, setUsername] = useState(""); // 사용자 아이디 상태 관리
  const [password, setPassword] = useState(""); // 비밀번호 상태 관리

  const handleLogin = async () => {
    // 아이디 또는 비밀번호가 입력되지 않았을 경우 알림창 표시 후 함수 종료
    if (!username || !password) {
      Swal.fire("로그인 실패", "아이디와 비밀번호를 입력해주세요", "error");
      return;
    }

    // 로그인 확인 알림창 표시
    Swal.fire({
      title: "로그인 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "로그인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 서버로 로그인 요청 보내기
          const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // 세션 쿠키 유지
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          // 로그인 성공 시 메인 페이지로 이동, 실패 시 오류 메시지 표시
          if (response.ok && data.success) {
            Swal.fire("로그인 성공!", "환영합니다!", "success");
            navigate("/");
          } else {
            Swal.fire("로그인 실패", data.message, "error");
          }
        } catch (error) {
          Swal.fire("로그인 오류", "서버와 연결할 수 없습니다.", "error");
        }
      }
    });
  };

  return (
    <div className="container">
      <div className="Login-Join">
        {/* 뒤로 가기 버튼 */}
        <div className="back-button" onClick={() => navigate("/")}>
          <IoCaretBackCircle size={32} />
        </div>

        {/* 로고 클릭 시 메인 페이지로 이동 */}
        <div className="title-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="Login-Join-logo" />
        </div>

        <div>
          {/* 아이디 입력 필드 */}
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            className="input-text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* 비밀번호 입력 필드 */}
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="input-text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 로그인 버튼 */}
        <button onClick={handleLogin} className="button">로그인</button>

        {/* 회원가입 링크 */}
        <p className="font-text">
          아직 회원가입을 안하셨나요?&nbsp;&nbsp;&nbsp;
          <Link to="/join" className="join-Btn">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;