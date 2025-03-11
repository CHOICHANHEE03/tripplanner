import React, { useEffect, useState } from 'react';
import '../css/MyPage.css';
import { FaHeartBroken } from 'react-icons/fa';

const MyPage = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const removeFavorite = (id) => {
        const updatedFavorites = favorites.filter((place) => place.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="mypage-section">
            <h2>❤️ 찜한 관광지</h2>
            {favorites.length === 0 ? (
                <p>찜한 관광지가 없습니다.</p>
            ) : (
                <div className="mypage-grid">
                    {favorites.map((place) => (
                        <div key={place.id} className="mypage-card">
                            {place.img && <img src={place.img} alt={place.title} className="card-img" />}
                            <h3>{place.title}</h3>
                            <p>{place.completed ? "완료" : "미완료"}</p>
                            <button className="remove-button" onClick={() => removeFavorite(place.id)}>
                                <FaHeartBroken /> 삭제
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPage;