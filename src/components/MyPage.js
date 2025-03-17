import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MyPage = () => {
  const [userId, setUserId] = useState(null); // 세션에서 가져온 사용자명
  const [userData, setUserData] = useState(null); // 데이터베이스에서 가져온 사용자 정보
  const [userReviewData, setUserReviewData] = useState([]); // 해당 유저 리뷰 정보
  const [userScheduleData, setUserScheduleData] = useState([]); // 해당 유저 일정 정보
  const navigate = useNavigate();

  // 세션 확인
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.authenticated && data.user) {
          setUserId(data.user); // 세션에서 사용자 정보 설정
        } else {
          navigate("/login"); // 로그인 되어 있지 않으면 로그인 페이지로 리다이렉트
        }
      } catch (error) {
        console.error("세션 확인 실패:", error);
        navigate("/login"); // 에러 발생 시 로그인 페이지로 리다이렉트
      }
    };

    checkSession();
  }, [navigate]);

  // 세션에서 가져온 사용자 정보를 기반으로 DB에서 유저 정보 가져옴
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/user/${userId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("사용자 정보 불러오기 실패");

          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("사용자 정보 가져오기 오류:", error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  // 사용자의 리뷰 정보 가져오기
  useEffect(() => {
    if (userId) {
      const fetchUserReviews = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/review/user/${userId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("사용자 리뷰 정보 불러오기 실패");

          const data = await response.json();
          setUserReviewData(data); // 리뷰 데이터 설정
        } catch (error) {
          console.error("사용자 리뷰 정보 가져오기 오류:", error);
        }
      };

      fetchUserReviews();
    }
  }, [userId]);

  // 사용자의 일정 정보 가져오기
  useEffect(() => {
    if (userId) {
      const fetchUserSchedules = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/schedule/user/${userId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("사용자 일정 정보 불러오기 실패");

          const data = await response.json();
          setUserScheduleData(data); // 일정 데이터 설정
        } catch (error) {
          console.error("사용자 일정 정보 가져오기 오류:", error);
        }
      };

      fetchUserSchedules();
    }
  }, [userId]);

  const handleEdit = () => {
    navigate(`/MyPage/edit/${userData.id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/${userData.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("사용자 삭제 실패");

      Swal.fire("사용자가 삭제되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("사용자 삭제 오류:", error);
    }
  };

  if (userData && userReviewData && userScheduleData) {
    return (
      <div className="mypage-info-container">
        <div>
          <h1>{userData.username}님의 회원 정보</h1>
          <p>아이디: {userData.username}</p>
          <p>비밀번호: {userData.password}</p>
          <p>이메일: {userData.email}</p>
        </div>

        <div className="mypage-info">
          <h2>{userData.username}님의 최근 리뷰 정보</h2>
          {userReviewData.length > 0 ? (
            userReviewData.map((review) => (
              <div key={review.id}>
                <h3>{review.title}</h3>
                <p>{review.content}</p>
              </div>
            ))
          ) : (
            <p>작성한 리뷰가 없습니다.</p>
          )}
        </div>

        <div className="mypage-info">
          <h2>{userData.username}님의 최근 일정 정보</h2>
          {userScheduleData.length > 0 ? (
            userScheduleData.map((schedule) => (
              <div key={schedule.id}>
                <h3>{schedule.title}</h3>
                <p>{schedule.description}</p>
              </div>
            ))
          ) : (
            <p>작성한 일정이 없습니다.</p>
          )}
        </div>

        <div className="review-detail-buttons">
          <button onClick={handleEdit} className="review-detail-button">
            수정하기
          </button>
          <button onClick={handleDelete} className="review-detail-button">
            삭제하기
          </button>
        </div>
      </div>
    );
  }

  return <div>로딩 중...</div>;
};

export default MyPage;
