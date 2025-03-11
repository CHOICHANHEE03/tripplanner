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

  const handleLogin = () => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("user", JSON.stringify({ username })); // 임시 로그인 처리
        Swal.fire("로그인 성공!", "환영합니다!", "success");
        navigate("/");
      }
    });
  };

  return (
    <div className="container">
      <div className="Login-Join">
        <div className="back-button" onClick={() => navigate(-1)}>
          <IoCaretBackCircle size={32} />
        </div>
        <div className="title-logo">
          <img src={logo} alt="Logo" className="Login-Join-logo" />
        </div>
        <div>
          <input 
            type="text" 
            placeholder="아이디를 입력해주세요" 
            className="input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="비밀번호를 입력해주세요" 
            className="input" 
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