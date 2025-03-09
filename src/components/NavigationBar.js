import React from 'react'
import {Link} from 'react-router-dom';
import '../css/NavigationBar.css';  
import logo from '../image/logo.png';

const NavigationBar = () => {
    return (
    <div className='navbar'>
        <img src={logo} alt='logo' className='navbar-logo'/>
        <div className="navbar-right">
            <Link className="navbarMenu" to={"/"}>Home</Link>
            <Link className="navbarMenu" to={"/tourisms"}>관광지</Link>
            <Link className="navbarMenu" to={"/events"}>행사</Link>
            <Link className="navbarMenu" to={"/review"}>리뷰</Link>
            <Link className="navbarMenu" to={"/schedule"}>일정관리</Link>
            <Link className="navbarMenu" to={"/login"}>로그인/회원가입</Link>
        </div>
    </div>



    );
};

export default NavigationBar;


