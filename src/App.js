import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Auth/Login';
import Join from './components/Auth/Join';
import Event from './components/Event/Event';
import EventDetail from './components/Event/EventDetail';
import Footer from './components/Function/Footer';
import NavigationBar from './components/Function/NavigationBar';
import Review from './components/Review/Review';
import ReviewAdd from './components/Review/ReviewAdd';
import ReviewDetail from './components/Review/ReviewDetail';
import ReviewEdit from "./components/Review/ReviewEdit";
import Schedule from './components/Schedule/Schedule';
import ScheduleAdd from './components/Schedule/ScheduleAdd';
import ScheduleDetail from './components/Schedule/ScheduleDetail';
import ScheduleEdit from './components/Schedule/ScheduleEdit';
import Tourism from './components/Tourism/Tourism';
import TourismDetail from './components/Tourism/TourismDetail';

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/join';

  return (
    <div className="App">
      {!isLoginPage && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/tourism/:id" element={<TourismDetail />} />
        <Route path="/event" element={<Event />} />  {/* 수정된 부분 */}
        <Route path="/event/:id" element={<EventDetail />} />  {/* 수정된 부분 */}
        <Route path="/review" element={<Review />} />  {/* 수정된 부분 */}
        <Route path="/tourism/review/:id" element={<ReviewAdd />} />
        <Route path="/event/review/:id" element={<ReviewAdd />} />
        <Route path="/review/:id" element={<ReviewDetail />} />
        <Route path="/review/edit/:id" element={<ReviewEdit />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/schedule/:id" element={<ScheduleDetail />} />
        <Route path="/schedule/add" element={<ScheduleAdd />} />
        <Route path="/schedule/edit/:scheduleId" element={<ScheduleEdit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
      </Routes>
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
