import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../image/logo.png";
import "../css/Home.css";

const Join = () => {
  const handleJoin = () => {
    Swal.fire({
      title: "회원가입 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "회원가입",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("회원가입 성공!", "환영합니다!", "success");
      }
    });
  };

  return (
    <div className="info-section">
      <div>
        <img src={logo} alt="Logo" />
      </div>
      <input type="text" placeholder="아이디를 입력해주세요" />
      <input type="password" placeholder="비밀번호를 입력해주세요" />
      <input type="text" placeholder="이메일을 입력해주세요" />
      <button onClick={handleJoin}>회원가입</button>
    </div>
  );
};

export default Join;