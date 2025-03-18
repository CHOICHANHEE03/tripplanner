import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackCircle } from "react-icons/io5";
import Swal from "sweetalert2"; // SweetAlert2를 사용하여 경고 창 처리
import "../css/ReviewDetail.css";

const ReviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null); // 로그인한 사용자 정보를 저장
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // 로그인 상태 체크

    // 세션 정보를 가져오기
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/session", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();

                if (data.authenticated) {
                    setCurrentUser(data.user);
                    setIsUserLoggedIn(true);
                    console.log("현재 로그인한 사용자 정보:", data.user);
                } else {
                    setIsUserLoggedIn(false);
                }
            } catch (error) {
                console.error("세션 확인 오류:", error);
                setIsUserLoggedIn(false);
            }
        };

        fetchSession();
    }, []);

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/review/${id}`);
                if (!response.ok) {
                    throw new Error("데이터를 불러오는 데 실패했습니다.");
                }
                const data = await response.json();

                if (data) {
                    setReviewData({
                        id: data.review_id,
                        title: data.title,
                        createdAt: data.createdAt,
                        username: data.username,
                        content: data.content,
                        rating: data.rating,
                    });
                }
            } catch (error) {
                console.error("데이터를 불러오는 중 오류 발생:", error);
                setReviewData(null);
                Swal.fire("오류", "리뷰 정보를 불러오는 데 실패했습니다.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchReviewData();
    }, [id]);

    const handleDelete = async () => {
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8080/api/review/${id}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) {
                        throw new Error("삭제에 실패했습니다.");
                    }
                    Swal.fire("삭제 완료!", "리뷰가 삭제되었습니다.", "success").then(() => {
                        navigate("/review"); // 리뷰 목록 페이지로 이동
                    });
                } catch (error) {
                    console.error("삭제 중 오류 발생:", error);
                    Swal.fire("오류", "삭제 중 문제가 발생했습니다.", "error");
                }
            }
        });
    };

    const handleEdit = () => {
        navigate(`/review/edit/${reviewData.id}`);
    };

    if (loading) {
        return <p>데이터를 불러오는 중...</p>;
    }

    if (!reviewData) {
        return <p>해당 리뷰 정보를 찾을 수 없습니다.</p>;
    }

    // currentUser와 reviewData가 모두 로딩된 후에 비교
    const isOwner = currentUser && reviewData && currentUser === reviewData.username;

    return (
        <div className="review-detail-container">
            <div className="review-detail-header">
                <div className="review-back-button" onClick={() => navigate(-1)}>
                    <IoCaretBackCircle size={32} />
                </div>
            </div>

            <div className="review-detail-form-container">
                <div className="review-detail-form">
                    <div className="review-detail-form-header">
                        <h2 className="review-detail-title">{reviewData.title}</h2>
                        <p><strong>작성날짜:</strong> {reviewData.createdAt}</p>
                        <p><strong>작성자:</strong> {reviewData.username}</p>
                        <div className="review-detail-title-header">
                            <h3>📄 리뷰 내용</h3>
                        </div>
                    </div>

                    <div className="review-detail-text">
                        <p><strong>평점:</strong> {reviewData.rating}점</p>
                        <p><strong>내용:</strong> {reviewData.content}</p>
                    </div>
                </div>
            </div>
            {isOwner && (
                <div className="review-detail-buttons">
                    <button onClick={handleEdit} className="review-detail-button">수정하기</button>
                    <button onClick={handleDelete} className="review-detail-button">삭제하기</button>
                </div>
            )}
        </div>
    );
};

export default ReviewDetail;
