import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import logo from "../image/logo.png";
import "../css/LoginJoin.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Swal.fire("로그인 실패", "아이디와 비밀번호를 입력해주세요", "error");
      return;
    }
    Swal.fire({
      title: "로그인 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "로그인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // 세션 쿠키 유지
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

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
        <div className="back-button" onClick={() => navigate("/")}>
          <IoCaretBackCircle size={32} />
        </div>
        <div className="title-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="Login-Join-logo" />
        </div>
        <div>
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            className="input-text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="input-text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} className="button">로그인</button>
        <p className="font-text">
          아직 회원가입을 안하셨나요?&nbsp;&nbsp;&nbsp;
          <Link to="/join" className="join-Btn">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
