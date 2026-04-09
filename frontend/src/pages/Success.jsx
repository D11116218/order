import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Success = ({ onClearOrder }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderItems = location.state?.orderItems || [];

  useEffect(() => {
    // 稍微延遲清除訂單，確保畫面已經渲染完成
    const timer = setTimeout(() => {
      if (orderItems.length > 0) {
        onClearOrder();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white text-gray-900 font-body min-h-screen pb-32">
      {/* Top Header */}
      <header className="w-full top-0 sticky bg-white z-50 border-b border-gray-100 flex items-center px-6 h-16 justify-center">
        <h1 className="text-[#e53935] font-black text-xl tracking-widest font-headline">訂餐系統</h1>
      </header>

      <main className="px-6 pt-8 max-w-md mx-auto">
        {/* Success Header Section */}
        <section className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[#e53935] text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-gray-900 tracking-tight mb-2">訂單已確認</h1>
          <p className="text-gray-500 font-medium font-body underline underline-offset-4 decoration-gray-200">
            {orderItems.length > 0 ? '您的美味餐點正在準備中' : '感謝您的訂購，系統已收到您的訂單'}
          </p>
        </section>

        {/* Order Details Card */}
        <section className="bg-white rounded-3xl p-6 mb-8 border border-gray-100 shadow-lg shadow-gray-100/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-xl font-bold text-gray-800">餐點明細</h2>
            <span className="material-symbols-outlined text-gray-300">receipt_long</span>
          </div>

          <div className="space-y-6">
            {orderItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-800">{item.displayName}</h3>
                  <p className="text-gray-400 text-xs mt-1">{item.quantity} × {item.remark || '標準口味'}</p>
                </div>
                <span className="font-headline font-bold text-gray-900">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50 flex justify-between items-center">
            <span className="text-gray-900 font-black text-xl">總金額</span>
            <span className="text-[#e53935] font-headline text-3xl font-black tracking-tight">${totalAmount}</span>
          </div>
        </section>

        <section className="flex flex-col gap-4 mb-16">
          <button 
            onClick={() => navigate('/orders')}
            className="w-full py-4 rounded-full bg-white border border-[#e53935] text-[#e53935] font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">list_alt</span>
            查看其他人訂單
          </button>
          
          <button 
            onClick={() => navigate('/admin')}
            className="w-full py-4 rounded-full bg-white border border-gray-300 text-gray-500 font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">verified_user</span>
            管理員模式
          </button>

          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-full bg-[#e53935] text-white font-bold text-[19px] flex items-center justify-center gap-3 shadow-lg shadow-red-100 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">home</span>
            返回首頁
          </button>
        </section>
      </main>

    </div>
  );
};

export default Success;
