import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoCaretBackCircle } from "react-icons/io5";
import logo from "../image/logo.png";
import "../css/LoginJoin.css";

const Join = () => {
    const navigate = useNavigate();

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
        <div className="container">
            <div className="Login-Join">
                <div className="back-button" onClick={() => navigate(-1)}>
                    <IoCaretBackCircle size={32} />
                </div>
                <div>
                    <img src={logo} alt="Logo" className="Login-Join-logo" />
                </div>
                <div className="input-container">
                    <input type="text" placeholder="아이디를 입력해주세요" className="input" />
                    <input type="password" placeholder="비밀번호를 입력해주세요" className="input" />
                    <input type="text" placeholder="이메일을 입력해주세요" className="input" />
                </div>
                <button onClick={handleJoin} className="button">회원가입</button>
            </div>
        </div>
    );
};

export default Join;