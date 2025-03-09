import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './components/Main';
import Tourism from './components/Tourism';
import Events from './components/Events';
import Review from './components/Review';
import Schedule from './components/Schedule';
import Login from './components/Login';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import ImageSlider from './components/ImageSlider';
import TouristInfo from './components/TouristInfo';
import EventInfo from './components/EventInfo';

const AppContent = () => {
  const location = useLocation();
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
      {!isLoginPage && <TouristInfo />}
      {!isLoginPage && <EventInfo />}
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default function WrappedApp() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}