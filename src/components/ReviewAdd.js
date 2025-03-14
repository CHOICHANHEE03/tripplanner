import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ReviewAdd = () => {
  const { id } = useParams(); // 관광지 ID 가져오기
  const navigate = useNavigate();
  const [reviewContent, setReviewContent] = useState(""); // 리뷰 내용
  const [rating, setRating] = useState(5); // 리뷰 평점 (기본값 5)
  const [error, setError] = useState(""); // 에러 메시지 상태

  // 리뷰 내용 입력 핸들러
  const handleReviewChange = (e) => {
    setReviewContent(e.target.value);
  };

  // 평점 선택 핸들러
  const handleRatingChange = (e) => {
    setRating(parseInt(e.target.value)); // 평점 숫자로 변환
  };

  // 리뷰 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewContent.trim()) {
      setError("리뷰 내용을 작성해주세요.");
      return;
    }

    const reviewData = {
      tourismId: id, // 관광지 ID
      username: "사용자", // 실제 사용자 이름을 넣을 수 있습니다 (로그인된 사용자 정보로 대체 가능)
      content: reviewContent,
      rating: rating, // 평점
    };

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("리뷰 저장에 실패했습니다.");
      }

      // 성공적으로 리뷰가 저장된 후 상세 페이지로 이동
      navigate(`/tourism/${id}`);
    } catch (error) {
      setError("리뷰 저장에 문제가 발생했습니다: " + error.message);
    }
  };

  return (
    <div className="write-review">
      <h2>리뷰 작성</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">평점: </label>
          <select id="rating" value={rating} onChange={handleRatingChange}>
            <option value={5}>5점</option>
            <option value={4}>4점</option>
            <option value={3}>3점</option>
            <option value={2}>2점</option>
            <option value={1}>1점</option>
          </select>
        </div>

        <div>
          <label htmlFor="reviewContent">리뷰 내용:</label>
          <textarea
            id="reviewContent"
            value={reviewContent}
            onChange={handleReviewChange}
            placeholder="리뷰를 작성하세요"
            rows="5"
            required
          />
        </div>

        <button type="submit">리뷰 제출</button>
      </form>
    </div>
  );
};

export default ReviewAdd;
