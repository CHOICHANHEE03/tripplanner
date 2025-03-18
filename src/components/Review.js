import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "./Pagination";
import Search from "./Search";
import "../css/Pagination.css";
import "../css/Review.css";

const Review = () => {
  const [review, setReview] = useState([]); // 필터링된 리뷰 데이터
  const [allReview, setAllReview] = useState([]); // 전체 리뷰 데이터 (누적된 데이터)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(""); // 세션에서 받아온 사용자 이름
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [currentGroup, setCurrentGroup] = useState(0); // 페이지 그룹
  const [view, setView] = useState("all"); // 리뷰 보기 방식
  const [size, setSize] = useState(5); // 한 페이지 크기
  const [searchTerm, setSearchTerm] = useState("");
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
          fetchReview(); // 첫 페이지 리뷰 데이터 불러옴
        } else {
          Swal.fire("오류", "로그인이 필요합니다.", "error");
          navigate("/login");
        }
      } catch (error) {
        Swal.fire("오류", "로그인 확인 중 오류가 발생했습니다.", "error");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  // 페이지네이션된 리뷰 데이터 불러옴
  const fetchReview = async () => {
    let allFetchedReview = [];
    let page = 0;
    let moreDataAvailable = true;

    // 데이터가 더 이상 없을 때까지 5개씩 페이지네이션
    while (moreDataAvailable) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/review?page=${page}&size=${size}`
        );
        if (!response.ok) throw new Error("서버 오류");

        const data = await response.json();

        if (data.content && Array.isArray(data.content)) {
          allFetchedReview = [...allFetchedReview, ...data.content]; // 데이터 누적
          if (data.content.length < size) {
            moreDataAvailable = false; // 더 이상 데이터가 없으면 종료
          }
        } else {
          break;
        }
      } catch (error) {
        Swal.fire(
          "오류",
          "리뷰 데이터를 불러오는 중 오류가 발생했습니다.",
          "error"
        );
        break;
      }
      page++; // 다음 페이지로 이동
    }

    setAllReview(allFetchedReview); // 모든 리뷰 데이터를 상태에 저장
    filterReview(allFetchedReview); // 필터링된 리뷰로 상태 업데이트
  };

  // 내 리뷰만 필터링하는 함수
  const filterReview = (review) => {
    let filteredReview = review;

    if (view === "mine") {
      filteredReview = filteredReview.filter((review) => {
        const reviewUsername =
          review.username && typeof review.username === "object"
            ? review.username.username
            : review.username;

        return reviewUsername?.trim() === username?.trim();
      });
    }

    // 검색어가 입력된 경우 정확히 일치하는 제목만 필터링
    if (searchTerm.trim() !== "") {
      filteredReview = filteredReview.filter(
        (review) => review.title.trim() === searchTerm.trim()
      );
    }

    setReview(filteredReview);
    const newTotalPages = Math.ceil(filteredReview.length / size);
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
    filterReview(allReview); // 보기 모드 변경 시 필터링된 리뷰를 바로 반영
  };

  // 페이지 변경 시 데이터 재로드
  useEffect(() => {
    filterReview(allReview); // 필터링 리뷰를 표시
  }, [currentPage]); // 번호 누를 떄 재실행

  // 모드 필터링된 리뷰를 업데이트
  useEffect(() => {
    filterReview(allReview);
  }, [searchTerm, view, allReview]);

  // 페이지네이션된 데이터 추출
  const getCurrentPageReview = () => {
    return review.slice((currentPage - 1) * size, currentPage * size); // 현재 페이지에 해당하는 리뷰
  };

  // pageNumbers 계산 (페이지 그룹에 맞는 페이지 번호 배열 생성)
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 검색 핸들러
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);

    if (term.trim() === "") {
      filterReview(allReview); // 기존 리뷰 데이터를 복원
    } else {
      const filtered = allReview.filter((review) =>
        review.title.trim() === term.trim()
      );
      setReview(filtered);
      setTotalPages(Math.ceil(filtered.length / size));
    }
  };

  return (
    <>
      <Search onSearch={handleSearch} />
      <div className="review-list-container">
        <div>
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
        </div>
        <div className="review-list-form">
          <div className="review-list-form-container">
            {review.length === 0 ? (
              <div className="no-review">
                <p>등록된 리뷰가 없습니다.</p>
              </div>
            ) : (
              <>
                <div className="review-cards-container">
                  {getCurrentPageReview().map((review) => (
                    <div className="review-card" key={review.review_id}>
                      <button
                        onClick={() => handleClick(review.review_id)}
                        className="review-card-btn"
                      >
                        <div className="review-card-content">
                          <div className="review-card-header">
                            <p className="review-card-text">
                              작성자: {review.username}
                            </p>
                            <p className="review-card-text">{review.createdAt}</p>
                          </div>
                          <p className="review-card-text">제목: {review.title}</p>
                          <p className="review-card-text">평점: {review.rating}점</p>
                          <p className="review-card-text">내용: {review.content}</p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
                {review.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageNumbers={pageNumbers}
                    currentGroup={currentGroup}
                    handlePageChange={handlePageChange}
                    onGroupChange={handleGroupChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Review;