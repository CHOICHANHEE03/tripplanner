import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import logo from "../../image/logo.png";
import "../../css/LoginJoin.css";

const Join = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수
    const [username, setUsername] = useState(""); // 사용자 아이디 상태 관리
    const [password, setPassword] = useState(""); // 비밀번호 상태 관리

    // 회원가입 처리 함수
    const handleJoin = async () => {
        // 입력 필드가 비어 있을 경우 오류 메시지 표시
        if (!username || !password) {
            Swal.fire("회원가입 실패", "모든 필드를 입력해주세요", "error");
            return;
        }

        // 회원가입 확인 알림창 표시
        Swal.fire({
            title: "회원가입 하시겠습니까?",
            icon: "question",
            showCancelButton: true, // 취소 버튼 활성화
            confirmButtonText: "회원가입", // 확인 버튼 텍스트
            cancelButtonText: "취소", // 취소 버튼 텍스트
        }).then(async (result) => {
            if (result.isConfirmed) { // 사용자가 확인 버튼을 클릭한 경우
                try {
                    // 서버로 회원가입 요청 보내기
                    const response = await fetch("http://localhost:8080/api/join", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json", // JSON 형식으로 요청 보냄
                        },
                        body: JSON.stringify({ username, password }), // 요청 본문에 유저 정보 포함
                    });

                    const data = await response.json(); // 응답 데이터를 JSON으로 변환

                    if (response.ok) {
                        // 회원가입 성공 시 메시지 표시 후 로그인 페이지로 이동
                        Swal.fire("회원가입 성공!", "환영합니다!", "success").then(() => {
                            navigate("/login");
                        });
                    } else {
                        // 회원가입 실패 시 서버에서 받은 메시지 표시
                        Swal.fire("회원가입 실패", data.message, "error");
                    }
                } catch (error) {
                    // 서버 오류 발생 시 메시지 표시
                    Swal.fire("회원가입 오류", "서버와 연결할 수 없습니다.", "error");
                }
            }
        });
    };

    return (
        <div className="container">
            <div className="Login-Join">
                {/* 뒤로 가기 버튼 */}
                <div className="back-button" onClick={() => navigate("/login")}>
                    <IoCaretBackCircle size={32} />
                </div>

                {/* 로고 클릭 시 홈으로 이동 */}
                <div className="title-logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" className="Login-Join-logo" />
                </div>

                {/* 입력 필드 */}
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="아이디를 입력해주세요"
                        className="input-text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // 입력값 변경 시 상태 업데이트
                    />
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        className="input-text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // 입력값 변경 시 상태 업데이트
                    />
                </div>

                {/* 회원가입 버튼 */}
                <button onClick={handleJoin} className="button">회원가입</button>
            </div>
        </div>
    );
};

export default Join;