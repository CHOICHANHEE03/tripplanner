import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Review.css";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/review/${id}`);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setUsername(data.user);
          fetchReviews();
        } else {
          Swal.fire("오류", "로그인이 필요합니다.", "error");
          navigate("/login");
        }
      } catch (error) {
        console.error("세션 확인 실패:", error);
        Swal.fire("오류", "로그인 확인 중 오류가 발생했습니다.", "error");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reviews");
      if (!response.ok) throw new Error("서버 오류");

      const data = await response.json();

      if (Array.isArray(data)) {
        setReviews(data);
      } else if (Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        console.error("리뷰 데이터가 예상과 다릅니다:", data);
        setReviews([]);
      }
    } catch (error) {
      console.error("리뷰 데이터 불러오기 오류:", error);
      Swal.fire(
        "오류",
        "리뷰 데이터를 불러오는 중 오류가 발생했습니다.",
        "error"
      );
    }
  };

  return (
    <div className="review-list-container">
      <div>
        <h2>📄 리뷰 목록</h2>
      </div>
      <div className="review-list-form">
        <div className="review-list-form-container">
          <div>
            {reviews.length === 0 ? (
              <p>등록된 리뷰가 없습니다.</p>
            ) : (
              <div className="review-cards-container">
                {reviews.map((review) => (
                  <div className="review-card" key={review.reviews_id}>
                    <button
                      onClick={() => handleClick(review.reviews_id)}
                      className="review-card-btn"
                    >
                      <div className="review-card-content">
                        <div className="review-card-header">
                        <p>
                          <strong>작성자:</strong> 
                          {review.username &&
                          typeof review.username === "object"
                            ? review.username.username || "Unknown"
                            : review.username || "Unknown"}
                        </p>
                        <p>{review.date}</p>
                        </div>
                        <p>
                          <strong>제목:</strong> {review.title}
                        </p>
                        <p>
                          <strong>별점:</strong> {review.rating}
                        </p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
