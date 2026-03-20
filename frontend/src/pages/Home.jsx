import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import './Home.css';

const Home = ({ userName, setUserName }) => {
  const [inputName, setInputName] = useState(userName || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (inputName.trim().length === 0) {
      setError('請輸入您的姓名');
      return;
    }
    setUserName(inputName.trim());
    navigate('/menu');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="brand-logo">
          <Utensils size={48} className="logo-icon" />
        </div>
        <h1 className="brand-title">線上點餐系統</h1>
        
        <form onSubmit={handleStart} className="name-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="請輸入您的姓名" 
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                if (error) setError('');
              }}
              className={error ? 'input-error' : ''}
              autoFocus
            />
            {error && <span className="error-text">{error}</span>}
          </div>
          <button type="submit" className="btn-primary start-btn">
            開始點餐
          </button>
        </form>
      </div>

    </div>
  );
};

export default Home;
