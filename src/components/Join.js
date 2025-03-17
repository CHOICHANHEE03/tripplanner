import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoCaretBackCircle } from "react-icons/io5";
import logo from "../image/logo.png";
import "../css/LoginJoin.css";

const Join = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const handleJoin = async () => {
        if (!username || !password || !nickname) {
            Swal.fire("회원가입 실패", "모든 필드를 입력해주세요", "error");
            return;
        }

        Swal.fire({
            title: "회원가입 하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "회원가입",
            cancelButtonText: "취소",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch("http://localhost:8080/api/signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, nickname, password }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        Swal.fire("회원가입 성공!", "환영합니다!", "success").then(() => {
                            navigate("/login");
                        });
                    } else {
                        Swal.fire("회원가입 실패", data.message, "error");
                    }
                } catch (error) {
                    Swal.fire("회원가입 오류", "서버와 연결할 수 없습니다.", "error");
                }
            }
        });
    };

    return (
        <div className="container">
            <div className="Login-Join">
                <div className="back-button" onClick={() => navigate("/login")}>
                    <IoCaretBackCircle size={32} />
                </div>
                <div className="title-logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" className="Login-Join-logo" />
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="아이디를 입력해주세요"
                        className="input-text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="닉네임을 입력해주세요"
                        className="input-text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                                        <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        className="input-text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleJoin} className="button">회원가입</button>
            </div>
        </div>
    );
};

export default Join;