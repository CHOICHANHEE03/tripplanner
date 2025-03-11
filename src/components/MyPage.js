import React, { useEffect, useState } from 'react';
import '../css/MyPage.css';
import { FaHeartBroken } from 'react-icons/fa';

const MyPage = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const removeFavorite = (name) => {
        const updatedFavorites = favorites.filter((place) => place.name !== name);
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
                    {favorites.map((place, index) => (
                        <div key={index} className="mypage-card">
                            <img src={place.imageUrl} alt={place.name} className="card-img" />
                            <h3>{place.name}</h3>
                            <p>{place.description}</p>
                            <button className="remove-button" onClick={() => removeFavorite(place.name)}>
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