import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "./Pagination";
import "../css/Pagination.css";
import "../css/Review.css";

const Review = () => {
  const [reviews, setReviews] = useState([]); // 필터링된 리뷰 데이터
  const [allReviews, setAllReviews] = useState([]); // 전체 리뷰 데이터 (누적된 데이터)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(""); // 세션에서 받아온 사용자 이름
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [currentGroup, setCurrentGroup] = useState(0); // 페이지 그룹
  const [view, setView] = useState("all"); // 리뷰 보기 방식
  const [size, setSize] = useState(5); // 한 페이지 크기
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/review/${id}`);
  };

  // 세션 확인 및 리뷰 데이터 불러옴
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
          setUsername(data.user); // 세션에서 사용자 이름을 가져옴
          fetchReviews(); // 첫 페이지 리뷰 데이터 불러옴
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

  // 페이지네이션된 리뷰 데이터 불러옴
  const fetchReviews = async () => {
    let allFetchedReviews = [];
    let page = 0;
    let moreDataAvailable = true;

    // 데이터가 더 이상 없을 때까지 5개씩 페이지네이션
    while (moreDataAvailable) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/reviews?page=${page}&size=${size}`
        );
        if (!response.ok) throw new Error("서버 오류");

        const data = await response.json();

        if (data.content && Array.isArray(data.content)) {
          allFetchedReviews = [...allFetchedReviews, ...data.content]; // 데이터 누적
          if (data.content.length < size) {
            moreDataAvailable = false; // 더 이상 데이터가 없으면 종료
          }
        } else {
          console.error("리뷰 데이터가 예상과 다릅니다:", data);
          break;
        }
      } catch (error) {
        console.error("리뷰 데이터 불러오기 오류:", error);
        Swal.fire(
          "오류",
          "리뷰 데이터를 불러오는 중 오류가 발생했습니다.",
          "error"
        );
        break;
      }
      page++; // 다음 페이지로 이동
    }

    setAllReviews(allFetchedReviews); // 모든 리뷰 데이터를 상태에 저장
    filterReviews(allFetchedReviews); // 필터링된 리뷰로 상태 업데이트
  };

  // 내 리뷰만 필터링하는 함수
  const filterReviews = (reviews) => {
    let filteredReviews = reviews;

    // 내 리뷰 보기 모드일 때만 필터링
    if (view === "mine") {
      filteredReviews = reviews.filter((review) => {
        const reviewUsername =
          review.username && typeof review.username === "object"
            ? review.username.username // 객체일 경우, username 필드 가져오기
            : review.username;

        // review.username과 username 값 비교
        return reviewUsername?.trim() === username?.trim();
      });
    }

    setReviews(filteredReviews); // 필터링된 리뷰로 상태 업데이트
    const newTotalPages = Math.ceil(filteredReviews.length / size); // 필터링된 리뷰에 따른 총 페이지 수 계산
    setTotalPages(newTotalPages);

    // 페이지 번호와 그룹 동기화 처리
    if (currentPage > newTotalPages) {
      setCurrentPage(1); // 총 페이지 수보다 현재 페이지가 더 크면 1페이지로 설정
    }
    setCurrentGroup(Math.floor((currentPage - 1) / 5)); // 페이지 그룹도 동기화
  };

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (page) => {
    setCurrentPage(page); // 페이지 변경
  };

  // 페이지를 그룹화화 변경
  const handleGroupChange = (direction) => {
    const newGroup = currentGroup + direction;
    if (newGroup >= 0 && newGroup < Math.ceil(totalPages / 5)) {
      setCurrentGroup(newGroup);

      // 페이지에 맞는 첫 번째 페이지로 이동
      const newPage = newGroup * 5 + 1;
      setCurrentPage(newPage); // 새로운 페이지 그룹의 첫 번째 페이지로 설정
    }
  };

  // 보기 모드 변경 (전체, 내 리뷰 보기)
  const handleViewChange = (event) => {
    const selectedView = event.target.value; // 선택된 값
    setView(selectedView); // view를 all 또는 mine으로 설정
    setCurrentPage(1); // 내 리뷰 보기를 눌렀을 때 첫 페이지로 리셋
    filterReviews(allReviews); // 보기 모드 변경 시 필터링된 리뷰를 바로 반영
  };

  // 페이지 변경 시 데이터 재로드
  useEffect(() => {
    filterReviews(allReviews); // 필터링 리뷰를 표시
  }, [currentPage]); // 번호 누를 떄 재실행

  // 모드 필터링된 리뷰를 업데이트
  useEffect(() => {
    filterReviews(allReviews); // allReviews 상태가 바뀔 때마다 필터링
  }, [view, allReviews]); // view 또는 allReviews 상태가 바뀔 때마다

  // 페이지네이션된 데이터 추출
  const getCurrentPageReviews = () => {
    return reviews.slice((currentPage - 1) * size, currentPage * size); // 현재 페이지에 해당하는 리뷰
  };

  // pageNumbers 계산 (페이지 그룹에 맞는 페이지 번호 배열 생성)
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="review-list-container">
      <div>
        <h2>📄 리뷰 목록</h2>
        <div className="review-view-select">
          <label htmlFor="view-selection">리뷰 유형: </label>
          <select id="view-selection" onChange={handleViewChange} value={view}>
            <option value="all">전체 리뷰 보기</option>
            {isAuthenticated && username && (
              <option value="mine">내 리뷰 보기</option>
            )}
          </select>
        </div>
      </div>
      <div className="review-list-form">
        <div className="review-list-form-container">
          <div>
            {reviews.length === 0 ? (
              <p>등록된 리뷰가 없습니다.</p>
            ) : (
              <div className="review-cards-container">
                {getCurrentPageReviews().map((review) => (
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            currentGroup={currentGroup}
            onPageChange={handlePageChange} // keep this as onPageChange
            onGroupChange={handleGroupChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Review;
