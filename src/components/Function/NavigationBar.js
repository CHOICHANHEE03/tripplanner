import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Function/NavigationBar.css';
import logo from '../../image/logo.png';

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 state
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 함수

    useEffect(() => {
        // 현재 세션 상태 확인하는 함수
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/session", {
                    method: "GET",
                    credentials: "include" // 쿠키를 포함하여 요청
                });
                const data = await response.json(); // 응답을 JSON 형식으로 변환
                setIsLoggedIn(data.authenticated); // 서버 응답을 바탕으로 로그인 상태 업데이트
            } catch (error) {
                // 오류 발생 시 아무 작업도 수행하지 않음
            }
        };

        checkSession(); // 컴포넌트가 마운트될 때 세션 확인 실행
    }, []);

    // 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/logout", {
                method: "GET",
                credentials: "include" // 쿠키 포함하여 요청
            });

            if (response.ok) {
                setIsLoggedIn(false); // 로그아웃 성공 시 상태 변경
                navigate('/'); // 홈으로 이동
            }
        } catch (error) {
            // 오류 발생 시 아무 작업도 수행하지 않음
        }
    };

    return (
        <div className='navbar'>
            {/* 로고 클릭 시 홈으로 이동 */}
            <img src={logo} alt='logo' className='navbar-logo' onClick={() => navigate("/")} />
            
            <div className="navbar-right">
                {/* 네비게이션 메뉴 */}
                <Link className="navbarMenu" to={"/"}>Home</Link>
                <Link className="navbarMenu" to={"/tourism"}>관광지</Link>
                <Link className="navbarMenu" to={"/event"}>행사</Link>
                <Link className="navbarMenu" to={"/review"}>리뷰</Link>
                <Link className="navbarMenu" to={"/schedule"}>일정관리</Link>

                {/* 로그인 상태에 따라 버튼 표시 */}
                {isLoggedIn ? (
                    <>
                        <button className="navbarMenu" onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <Link className="navbarMenu" to={"/login"}>로그인</Link>
                )}
            </div>
        </div>
    );
};

export default NavigationBar; // 컴포넌트 내보내기