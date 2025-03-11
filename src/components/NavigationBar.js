import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavigationBar.css';
import logo from '../image/logo.png';

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user); // user 정보가 있으면 true, 없으면 false
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className='navbar'>
            <img src={logo} alt='logo' className='navbar-logo' />
            <div className="navbar-right">
                <Link className="navbarMenu" to={"/"}>Home</Link>
                <Link className="navbarMenu" to={"/tourism"}>관광지</Link>
                <Link className="navbarMenu" to={"/events"}>행사</Link>
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