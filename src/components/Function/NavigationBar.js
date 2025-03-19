import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Function/NavigationBar.css';
import logo from '../../image/logo.png';
import axios from 'axios';

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 저장하는 state
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 함수

    useEffect(() => {
        const token = localStorage.getItem("token"); // JWT가 로컬 스토리지에 있는지 확인
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // 로그아웃 처리 함수
    const handleLogout = () => {

        localStorage.removeItem("token"); // 로컬 스토리지에서 JWT 삭제

        delete axios.defaults.headers.common["Authorization"];

        setIsLoggedIn(false);
        navigate('/'); // 홈으로 이동
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

export default NavigationBar;