import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, List, Home, ShieldCheck } from 'lucide-react';
import './Success.css';

const Success = ({ onClearOrder }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderItems = location.state?.orderItems || [];

  useEffect(() => {
    if (orderItems.length > 0) {
      onClearOrder();
    }
  }, []);

  return (
    <div className="success-container page-enter-active">
      <div className="success-header">
        <CheckCircle size={80} color="var(--primary-color)" className="success-icon" />
        <h2>訂購完成</h2>
        <p className="wait-message">請等候您的餐點 😊</p>
      </div>

      <div className="my-order-summary">
        <h3>您的點餐明細</h3>
        <div className="my-order-list">
          {orderItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="my-order-item">
              <span className="qty">{item.quantity}x</span>
              <div className="item-details">
                <div className="item-name-row">
                  <span className="name">{item.displayName}</span>
                  <span className="price">${item.price * item.quantity}</span>
                </div>
                {item.remark && <span className="remark text-secondary">({item.remark})</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bottom-action">
        <button className="btn-primary secondary outline-btn" onClick={() => navigate('/orders')}>
          <List size={20} />查看其他人訂單
        </button>

        <button
          className="admin-btn-secondary"
          onClick={() => {
            const pwd = prompt('請輸入管理員密碼:');
            if (pwd === '54291981') {
              navigate('/admin');
            } else if (pwd !== null) {
              alert('密碼錯誤！');
            }
          }}
        >
          <ShieldCheck size={20} /> 管理員模式
        </button>

        <button className="btn-primary" onClick={() => navigate('/')}>
          <Home size={20} />返回首頁
        </button>
      </div>
    </div>
  );
};

export default Success;
