import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom"; // useLocation을 추가
import { PiStarFill, PiStarLight } from "react-icons/pi";
import "../css/ReviewAdd.css";

const ReviewAdd = () => {
  const { id } = useParams(); // URL에서 관광지 ID 가져오기
  const location = useLocation(); // useLocation 훅 사용
  const { productInfo } = location.state || {}; // location.state에서 productInfo 가져오기

  const [username, setUserName] = useState(null); // 사용자 이름 상태
  const [rating, setRating] = useState(0); // 별점 상태
  const [content, setContent] = useState(""); // 리뷰 내용 상태
  const [title, setTitle] = useState(""); // 리뷰 제목 상태
  const [contenttypeid, setContenttypeid] = useState(""); // 관광지 유형 상태

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

  const handleContenttypeidChange = (e) => {
    const selectedValue = e.target.value;
    setContenttypeid(selectedValue ? parseInt(selectedValue, 10) : null);
  };

  const handleSubmit = async () => {
    if (rating === 0 || content.length < 15 || contenttypeid === null || contenttypeid === "") {
      alert("별점과 15자 이상의 리뷰를 작성해 주세요.");
      return;
    }

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
          tourismId: id, // id 값 추가
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
    <div>
      <div>
        <p>관광지 ID: {id}</p> {/* 여기서 URL에 있는 ID를 표시 */}
      </div>

      {productInfo && (
        <div className="flex min-w-0 gap-x-4">
          <img className="h-20 w-20 flex-none square-full bg-gray-50" src={productInfo.imageUr} alt="관광지 이미지" />
          <div className="min-w-0 flex-auto">
            <p className="text-sm font-semibold leading-6 text-gray-900 mt-4">{productInfo.name}</p>
            <p className="truncate text-xs leading-5 text-gray-500 mt-4">{productInfo.date}</p>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default ReviewAdd;
