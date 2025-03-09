import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../image/logo.png";
import "../css/LoginJoin.css";

const Login = () => {
  const handleLogin = () => {
    Swal.fire({
      title: "로그인 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "로그인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("로그인 성공!", "환영합니다!", "success");
      }
    });
  };

  return (
  <div className="container">
  <div className="Login-Join">
    <div className="title-logo">
      <img src={logo} alt="Logo" />
    </div>
    <div>
      <input type="text" placeholder="아이디를 입력해주세요" className="input"/>
      <input type="password" placeholder="비밀번호를 입력해주세요" className="input"/>
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