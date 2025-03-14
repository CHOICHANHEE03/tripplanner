import React, { useState, useEffect, useCallback } from "react";
// import { useLocation } from "react-router-dom";
import { PiStarFill, PiStarLight } from "react-icons/pi";
import Tourism from "./Tourism";
import "../css/ReviewAdd.css";

const ReviewAdd = () => {
  // const location = useLocation();
  // const { productInfo } = location.state || {};

  const [username, setUserName] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [contenttypeid, setContenttypeid] = useState("");  

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        console.log("🔵 서버에서 받은 세션 데이터:", data);

        if (data.authenticated && data.user) {
          console.log("🟢 로그인된 유저 ID:", data.user);
          setUserName(data.user);
        } else {
          console.log("🔴 로그인되지 않음");
          setUserName(null);
        }
      } catch (error) {
        console.error("🛑 세션 확인 실패:", error);
        setUserName(null);
      }
    };

    checkSession();
  }, []);

  // 타이틀 변경 시 처리 함수
  const handleTitleChange = (e) => {
    setTitle(e.target.value); // 타이틀 변경
  };

  // 평점 클릭 시 처리 함수
  const handleClickStar = (index) => {
    setRating(index + 1); // 클릭한 별의 인덱스를 반영하여 rating을 설정
  };

  // 리뷰 내용 변경 시 처리 함수
  const handleReviewChange = (e) => {
    setContent(e.target.value);
  };
  // 관광지 타입 변경 시 처리 함수
  const handleContenttypeidChange = (e) => {
    const selectedValue = e.target.value;
    setContenttypeid(selectedValue ? parseInt(selectedValue, 10) : null);
  };

  const handleSubmit = async () => {
    if (rating === 0 || content.length < 15 || contenttypeid === null || contenttypeid === "") {
      alert("별점과 15자 이상의 리뷰를 작성해 주세요.");
      return;
    }

    console.log("보내는 데이터:", {
      rating: rating,
      content: content,
      username: username,
      contenttypeid: contenttypeid,
    });

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: rating,
          content: content,
          username: username,
          contenttypeid: contenttypeid,
        }),
      });

      if (response.ok) {
        alert("리뷰가 성공적으로 등록되었습니다.");
        setRating(0);
        setContent("");
        setContenttypeid("");
      } else {
        alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("서버에 연결할 수 없습니다. 다시 시도해 주세요.");
    }
  };

  return (
    //<div>
    //<img src={productInfo.firstimage} alt={productInfo.title} />
    //<div>
    //<p>{productInfo.title}</p>
    //</div>
    <div className="review-container">
      <div className="review-header">
        <p>여행하신 의견을 남겨주세요!</p>
      </div>

      <div className="reviewform-container">
        <div className="form-title">
          <h1>상세리뷰를 작성해주세요.</h1>
        </div>
        <div className="star-text-container">
          <p>평점을 남겨주세요:</p>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <div key={i} onClick={() => handleClickStar(i)}>
                {i < rating ? (
                  <PiStarFill className="star-lg" />
                ) : (
                  <PiStarLight className="star-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="review-title">
          <label htmlFor="title">제목:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목을 입력해주세요"
            className="reviewform-title"
          />
        </div>
        <div className="contenttypeid-container">
          <label htmlFor="contenttypeid">관광지 유형:</label>
          <select
            id="contenttypeid"
            value={contenttypeid}
            onChange={handleContenttypeidChange}
            className="contenttypeid-select"
          >
            <option value="">===선택하세요===</option>
            <option value="12">관광지</option>
            <option value="14">문화시설</option>
            <option value="15">행사/공연/축제</option>
            <option value="28">레포츠</option>
          </select>
        </div>
        <div className="star-text-container">
          <p>내용: </p>
          <input
            id="text"
            type="text"
            value={content}
            onChange={handleReviewChange}
            cols="50"
            placeholder="내용 15자 이상 기입해주세요. "
            className="reviewform-text"
          />
        </div>

        <button onClick={handleSubmit} className="reviewform-btn">
          등록하기
        </button>
      </div>
    </div>
  );
};

export default ReviewAdd;
