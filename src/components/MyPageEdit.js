import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyPage.css";

const MyPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState(null); // 유저 아이디 상태
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null); // 유저 데이터 상태
  const [userName, setUserName] = useState(""); // 세션에 있는 유저 이름 상태
  const navigate = useNavigate();

  // 수정하려는 유저 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    if (userId) {
      const fetchReview = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/user/${userId}`);
          if (!response.ok) throw new Error("유저 정보를 불러오는 데 실패했습니다.");
          const data = await response.json();

          setUsername(data.username); // 기존 유저 아이디
          setNickname(data.nickname); // 기존 닉네임
          setPassword(data.password); // 기존 비밀번호
          setIsEdit(true); // 수정 모드 활성화
        } catch (error) {
          console.error("유저 데이터 가져오기 실패:", error);
        }
      };
      fetchReview();
    }
  }, [userId]);

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
          setUserId(data.user.id); // 로그인한 유저의 id 저장
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

  // 핸들러들
  const handleUserNameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNicknameChange = (e) => setNickname(e.target.value);

  // 유저 정보 수정 및 추가
  const handleSubmit = async () => {
    if (!username || !nickname || !password) {
      alert("아이디, 닉네임, 비밀번호를 입력해주세요.");
      return;
    }
    const userData = {
      id: userId,
      username: username,
      nickname: nickname,
      password: password,
    };

    try {
      const response = isEdit
        ? await fetch(`http://localhost:8080/api/user/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          })
        : await fetch("http://localhost:8080/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

      if (response.ok) {
        alert(isEdit ? "유저 정보가 수정되었습니다." : "유저 정보가 성공적으로 등록되었습니다.");
        navigate("/mypage"); // 수정 후 마이페이지로 리다이렉트
      } else {
        alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      alert("서버에 연결할 수 없습니다. 다시 시도해 주세요.");
    }
  };

  // 유저 데이터 로딩 중
  if (!userData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mypage-info-container">
      <h2>{userData.username}님의 회원 정보</h2>
      <p>아이디: {userData.username}</p>
      <p>비밀번호: {userData.password}</p>
      <p>이메일: {userData.email}</p>

      <div className="mypage-edit">
        <h3>정보 수정</h3>
        <input
          type="text"
          value={username}
          onChange={handleUserNameChange}
          placeholder="아이디"
        />
        <input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호"
        />
        <button onClick={handleSubmit}>{isEdit ? "수정하기" : "등록하기"}</button>
      </div>
    </div>
  );
};

export default MyPage;
