import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, CheckCircle } from 'lucide-react';
import './Checkout.css';

const Checkout = ({ userName, orderItems, onUpdateItem, onClearOrder }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemarkChange = (id, isNoSide, value) => {
    const item = orderItems.find(i => i.id === id && i.isNoSide === isNoSide);
    if (item) {
      onUpdateItem({ ...item, remark: value });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          items: orderItems,
          totalAmount
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClearOrder();
          navigate('/');
        }, 3000);
      } else {
        throw new Error(data.message || '送出失敗');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('無法連接伺服器，請確認伺服器已啟動。' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="checkout-container success-view page-enter-active">
        <CheckCircle size={80} color="var(--primary-color)" className="success-icon" />
        <h2>訂單送出成功！</h2>
        <p>我們會盡快為您準備餐點 😊</p>
        <p className="redirect-hint">3秒後自動返回首頁...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container page-enter-active">
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
        <h1>確認訂單</h1>
      </header>

      <div className="checkout-content">
        <div className="user-info-card">
          <div className="info-row">
            <span className="info-label">訂購人</span>
            <span className="info-value">{userName}</span>
          </div>
        </div>

        <div className="order-list-section">
          <div className="section-title">
            <Receipt size={20} />
            <h2>訂單明細</h2>
          </div>
          
          <div className="order-items">
            {orderItems.map((item, idx) => (
              <div key={`${item.id}-${item.isNoSide}`} className="order-item-card">
                <div className="item-main-info">
                  <div className="item-name-qty">
                    <span className="qty">{item.quantity}x</span>
                    <span className="name">{item.displayName}</span>
                  </div>
                  <span className="item-price">${item.price * item.quantity}</span>
                </div>
                
                <div className="item-remark">
                  <input 
                    type="text" 
                    placeholder="備註 (如：飯少、小辣等)" 
                    value={item.remark || ''}
                    onChange={(e) => handleRemarkChange(item.id, item.isNoSide, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="order-total-card">
            <span className="total-label">總共 {orderItems.reduce((s,i) => s + i.quantity, 0)} 項商品</span>
            <div className="total-price-wrap">
              <span>總金額</span>
              <span className="amount">${totalAmount}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="error-alert">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="bottom-checkout-bar">
        <button 
          className="btn-primary submit-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '送出中...' : `確認送出 $${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
