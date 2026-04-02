import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6" 
         style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(211,47,47,0.05) 100%), var(--surface-color)' }}>
      
      <div className="w-full max-w-[320px] text-center animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Brand Logo */}
        <div className="w-24 h-24 bg-[#d32f2f] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_12px_24px_rgba(211,47,47,0.3)]">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            skillet
          </span>
        </div>

        {/* Brand Title */}
        <h1 className="text-4xl font-extrabold text-[#1d1d1f] tracking-[2px] mb-2 font-headline">
          雞肉本家
        </h1>
        <p className="text-[#86868b] text-lg mb-12 font-body">
          炭火熟成 ‧ 職人手作
        </p>

        {/* Name Form */}
        <form onSubmit={handleStart} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-left">
            <input
              type="text"
              placeholder="請輸入您的姓名"
              className={`w-full px-5 py-4 rounded-2xl border-2 border-[#e5e5ea] focus:border-[#d32f2f] focus:bg-white focus:shadow-[0_0_0_4px_rgba(211,47,47,0.1)] transition-all duration-300 text-lg bg-white/80 ${error ? 'border-red-500' : ''}`}
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                if (error) setError('');
              }}
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center font-bold">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#d32f2f] text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            開始點餐
          </button>
        </form>
      </div>

    </div>
  );
};

export default Home;
