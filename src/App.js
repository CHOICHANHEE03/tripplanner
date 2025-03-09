import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';  // BrowserRouter를 Router로 사용

// 대문자로 시작하는 컴포넌트 임포트
import Home from './components/Main';
import Tourism from './components/Tourism';
import Events from './components/Events';
import Review from './components/Review';
import Schedule from './components/Schedule';
import Login from './components/Login';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import ImageSlider from './components/ImageSlider';

const App = () => {
  const location = useLocation();  // 현재 URL을 가져옴

  // 로그인 페이지에서만 네비게이션 바와 푸터를 숨김
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
      {!isLoginPage && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/events" element={<Events />} />
        <Route path="/review" element={<Review />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!isLoginPage && <ImageSlider />}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
