import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavigationBar.css';
import logo from '../image/logo.png';

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/session", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await response.json();
                setIsLoggedIn(data.authenticated);
            } catch (error) {
                console.error("세션 확인 실패:", error);
            }
        };

        checkSession();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/logout", {
                method: "GET",
                credentials: "include"
            });

            if (response.ok) {
                setIsLoggedIn(false);
                navigate('/');
            } else {
                console.error("로그아웃 실패");
            }
        } catch (error) {
            console.error("로그아웃 오류:", error);
        }
    };

    return (
        <div className='navbar'>
            <img src={logo} alt='logo' className='navbar-logo' onClick={() => navigate("/")} />
            <div className="navbar-right">
                <Link className="navbarMenu" to={"/"}>Home</Link>
                <Link className="navbarMenu" to={"/tourism"}>관광지</Link>
                <Link className="navbarMenu" to={"/event"}>행사</Link>
                <Link className="navbarMenu" to={"/review"}>리뷰</Link>
                <Link className="navbarMenu" to={"/schedule"}>일정관리</Link>
                {isLoggedIn ? (
                    <>
                        <Link className="navbarMenu" to={"/mypage"}>마이페이지</Link>
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