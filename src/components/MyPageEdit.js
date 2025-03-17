import React, { useState, useEffect } from "react";
import { PiStarFill, PiStarLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import "../css/MyPage.css";

const MyPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  // 수정하려는 유저 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    if (id) {
      // 수정 모드일 경우, 해당 유저 데이터 가져오기
      const fetchReview = async () => {
        console.log("user ID:", id);
        try {
          const response = await fetch(`http://localhost:8080/api/user/${id}`);
          if (!response.ok)
            throw new Error("유저 정보를 불러오는 데 실패했습니다.");
          const data = await response.json();

          setRating(data.username); // 기존 유저 아이디
          setContent(data.nickname); // 기존 닉네임
          setTitle(data.password); // 기존 비밀번호
          setIsEdit(true); // 수정 모드 활성화
        } catch (error) {
          console.error("유저 데이터 가져오기 실패:", error);
        }
      };
      fetchReview();
    }
  }, [id]);

  // 세션 확인 (로그인 상태)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.authenticated && data.user) {
          setUserName(data.user);
        } else {
          setUserName(null);
        }
      } catch (error) {
        console.error("세션 확인 실패:", error);
        setUserName(null);
      }
    };

    checkSession();
  }, []);
};
const handleUserNameChange = (e) => setUserName(e.target.value);

const handlePassWordChange = (e) => setPassWord(e.target.value);

const handleUserNickNameChange = (e) => setUserNickNameChange(e.target.value);

const handleSubmit = async () => {
  if (rating === 0 || content.length < 15) {
    alert("아이디,닉네임,비밀번호를 입력해주세요.");
    return;
  }
  const userData = {
    user_id: id,
    username: username,
    nickname: nickname,
    password: password,
  };
  try {
    const response = isEdit
      ? await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        })
      : await fetch("http://localhost:8080/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        });

    if (response.ok) {
      alert(
        isEdit
          ? "유저 정보가 수정되었습니다."
          : "유저 정보가 성공적으로 등록되었습니다."
      );
      setRating(0);
      setContent("");
      setTitle(productInfo?.title || "");
      navigate("/review/:id");
    } else {
      alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("서버에 연결할 수 없습니다. 다시 시도해 주세요.");
  }
};

if (userData) {
  return (
    <div className="mypage-info-container">
      <h2>{userData.username}님의 회원 정보</h2>
      <p>아이디: {userData.username}</p>
      <p>비밀번호: {userData.password}</p>
      <p>이메일: {userData.email}</p>
    </div>
  );
}
<div className="review-detail-buttons">
  <button onClick={handleEdit} className="review-detail-button">
    수정하기
  </button>
  <button onClick={handleDelete} className="review-detail-button">
    삭제하기
  </button>
</div>;
return <div>로딩 중...</div>;
