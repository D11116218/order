import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Users } from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbxApIzcf2wzbkAEUtYDJ2ka3c4P0wG5ZigOEVJquPIizhkuw-tRsEIZq5Kk-jV3r07Y/exec';
      const response = await fetch(apiUrl);
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container page-enter-active">
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
        <h1>大家點了什麼</h1>
        <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
          <RefreshCw size={20} className={loading ? 'spinning' : ''} />
        </button>
      </header>

      <div className="orders-list">
        {loading ? (
          <div className="loading-state">
            <RefreshCw size={32} className="spinning text-secondary" />
            <p>正在拉取最新訂單...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>目前還沒有任何訂單記錄唷！</p>
          </div>
        ) : (
          orders.map((order, idx) => (
            <div key={idx} className="global-order-card">
              <div className="order-user">
                <div className="user-info">
                  <Users size={16} />
                  <span className="user-name">{order.name}</span>
                </div>
              </div>
              <div className="order-item-row">
                <div className="item-info">
                  <span className="qty">{order.quantity}x</span>
                  <span className="name">{order.item}</span>
                </div>
                <span className="total-amount">${order.total}</span>
              </div>
              {order.remark && <div className="remark-box">{order.remark}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
