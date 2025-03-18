import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PiStarFill, PiStarLight } from "react-icons/pi";
import "../css/ReviewAdd.css";

const ReviewAdd = () => {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const { productInfo } = location.state || {}; 

  const [username, setUserName] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState(productInfo?.title || "");

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

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleClickStar = (index) => setRating(index + 1);
  const handleReviewChange = (e) => setContent(e.target.value);

  const handleSubmit = async () => {
    if (rating === 0 || content.length < 15) {
      alert("평점과 15자 이상의 리뷰를 작성해 주세요.");
      return;
    }

    try {
      console.log({ rating, content, username, title });

      const response = await fetch("http://localhost:8080/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, content, username, title }),
      });

      if (response.ok) {
        alert("리뷰가 성공적으로 등록되었습니다.");
        setRating(0);
        setContent("");
        setTitle(productInfo?.title || "");

        navigate("/review"); 
      } else {
        alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      alert("서버에 연결할 수 없습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="review-add-container">
      <div className="review-add-detail-container">
        {productInfo && (
          <div className="before-information">
            <div>
              <img
                src={productInfo.firstimage}
                alt="관광지 이미지"
                className="before-img"
              />
            </div>
            <div>
              <p className="before-title">{productInfo.title} </p>
            </div>
          </div>
        )}

        <div className="review-container">
          <div className="review-header">
            <p>이번 여행은 어떠셨나요?</p>
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
                value={productInfo.title}
                readOnly
                onChange={handleTitleChange}
                className="reviewform-title"
              />
            </div>
            <div className="star-text-container">
              <p>내용: </p>
              <textarea
                id="text"
                value={content}
                onChange={handleReviewChange}
                placeholder="내용 15자 이상 기입해주세요."
                className="reviewform-text"
                rows="5"
                cols="50"
              />
            </div>
            <button onClick={handleSubmit} className="reviewform-btn">
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAdd;