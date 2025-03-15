import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import "../css/ReviewDetail.css";

const ReviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/reviews/${id}`);
                if (!response.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();
                if (data) {
                    setReviewData({
                        id: data.id,
                        title: data.title,
                        date: data.date,
                        username: data.username?.username || "알 수 없음",  // 객체일 경우 username 속성 값 사용
                        content: data.content,
                        rating: data.rating,
                    });
                }
            } catch (error) {
                console.error("데이터를 불러오는 중 오류 발생:", error);
                setReviewData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewData();
    }, [id]);

    if (loading) {
        return <p>데이터를 불러오는 중...</p>;
    }

    if (!reviewData) {
        return <p>해당 리뷰 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="review-detail-container">
            <div className="review-detail-header">
            <div className="review-back-button" onClick={() => navigate(-1)}>
                <IoCaretBackCircle size={32} />
            </div>
            <div className="review-header-title"> 
            <h3>📄 리뷰 목록</h3>
            </div>
            </div>
            <div>
                <h2 className="review-detail-title">{reviewData.title}</h2>
                <p><strong>작성자:</strong> {reviewData.username}</p> 
                <p><strong>날짜:</strong> {reviewData.date }</p>
                <p><strong>별점:</strong> {reviewData.rating} / 5</p>
                <p><strong>내용:</strong> {reviewData.content }</p>
            </div>
        </div>
    );
};

export default ReviewDetail;
