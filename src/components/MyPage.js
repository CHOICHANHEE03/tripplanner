import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import defaultProfileImage from "../image/null_image.png";

const MyPage = () => {
  const [userId, setUserId] = useState(null); // 세션에서 가져온 사용자명
  const [userData, setUserData] = useState(null); // 데이터베이스에서 가져온 사용자 정보
  const [userReviewData, setUserReviewData] = useState([]); // 해당 유저 리뷰 정보
  const [userScheduleData, setUserScheduleData] = useState([]); // 해당 유저 일정 정보
  const [image, setImage] = useState(null); // 이미지 상태 추가
  const navigate = useNavigate();

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
          // 이미지가 없으면 기본 이미지로 설정
          setImage(data.profileImage || defaultProfileImage); // 기본 이미지 경로 설정
        } catch (error) {
          console.error("사용자 정보 가져오기 오류:", error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  // "수정하기" 버튼 클릭 시 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/MyPage/edit/${userData.id}`);
  };

  // 삭제하기 처리 함수
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

      // 삭제 성공 시
      Swal.fire("사용자가 삭제되었습니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error("사용자 삭제 오류:", error);
    }
  };

  if (userData && userReviewData && userScheduleData) {
    return (
      <div className="mypage-info-container">
        <div>
          <h1>{userData.username}님의 회원 정보</h1>
          {/* 프로필 이미지 표시 */}
          <img
            src={image} // 이미지가 없으면 기본 이미지 사용
            alt="프로필 사진"
            className="profile-image"
          />
          <p>아이디: {userData.username}</p>
          <p>닉네임: {userData.nickname}</p>
          <p>비밀번호: {userData.password}</p>
        </div>
        
        <div className="review-detail-buttons">
          <button onClick={handleEdit} className="review-detail-button">
            수정하기
          </button>
          <button onClick={handleDelete} className="review-detail-button">
            삭제하기
          </button>
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
      </div>
    );
  }

  return <div>로딩 중...</div>;
};

export default MyPage;
