import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, CheckCircle, Plus, Minus } from 'lucide-react';
import './Checkout.css';

const Checkout = ({ userName, orderItems, onUpdateItem, onClearOrder }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 定義客製化選項群組
  const optionGroups = [
    { id: 'spicy', name: '辣度', options: ['大辣', '中辣', '小辣', '不辣'] },
    { id: 'scallion', name: '青蔥', options: ['蔥多', '蔥少'] },
    { id: 'rice', name: '飯量', options: ['飯多', '飯少'] }
  ];

  const handleToggleOption = (item, groupId, optionLabel) => {
    const currentOptions = item.selectedOptions || {};
    const newOptions = { ...currentOptions };

    // 如果點擊的是原本已經選的，就取消選取 (切換)
    if (newOptions[groupId] === optionLabel) {
      delete newOptions[groupId];
    } else {
      newOptions[groupId] = optionLabel;
    }

    // 重新組合字串，放入 remark 提供給後台
    const remarkString = Object.values(newOptions).join(', ');

    onUpdateItem({
      ...item,
      selectedOptions: newOptions,
      remark: remarkString
    });
  };

  const handleQtyChange = (item, newQuantity) => {
    onUpdateItem({
      ...item,
      quantity: newQuantity
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const apiUrl = 'https://script.google.com/macros/s/AKfycbw0PRd07CmA2X83VS9fsUp75wnVC2t9IjDICi_s3kSskE_99WDqzqLcsjDRsbidpYBBLw/exec';
      
      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name: userName,
          items: orderItems,
          totalAmount
        }),
      });

      // 使用 no-cors 會收到 opaque response，無法讀取詳細內容，
      // 只要沒有拋出 catch 錯誤，我們就視為成功。
      navigate('/success', { state: { orderItems } });
    } catch (err) {
      console.error(err);
      setErrorMsg('傳送失敗，請確認 API 網址設定正確或網路連線。' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 若沒餐點了(都被減為0)，自動回菜單
  if (orderItems.length === 0) {
    setTimeout(() => navigate('/menu'), 0);
    return null;
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
          <p className="section-subtitle">※無須調整為正常(加蔥、小辣)</p>
          
          <div className="order-items">
            {orderItems.map((item) => {
              // 某些餐點可能不適合顯示特定選項 (例如果汁/湯不顯示飯量)
              // 這裡採用簡單判定：只要不是熱湯跟果醋，就可以顯示選項。
              // 透過 item.id 判斷，sp: 湯, d: 果醋
              const showOptions = !(item.id.startsWith('sp') || item.id.startsWith('d'));
              
              return (
                <div key={`${item.id}-${item.isNoSide}`} className="order-item-card">
                  
                  {/* 上半部：餐點名稱與數量控制 */}
                  <div className="item-main-header">
                    <div className="item-title-area">
                      <span className="name">{item.displayName}</span>
                      <span className="item-price">${item.price * item.quantity}</span>
                    </div>
                    
                    <div className="checkout-qty-control">
                      <button 
                        className="qty-btn small-btn remove" 
                        onClick={() => handleQtyChange(item, item.quantity - 1)}
                      ><Minus size={14} /></button>
                      <span className="qty-count">{item.quantity}</span>
                      <button 
                        className="qty-btn small-btn add" 
                        onClick={() => handleQtyChange(item, item.quantity + 1)}
                      ><Plus size={14} /></button>
                    </div>
                  </div>
                  
                  {/* 下半部：客製化標籤 (僅主餐/單點顯示) */}
                  {showOptions && (
                    <div className="item-options-area">
                      {optionGroups.map((group) => (
                        <div key={group.id} className="option-group">
                          <span className="option-label-small">{group.name}</span>
                          <div className="option-chips">
                            {group.options.map(opt => {
                              const isSelected = (item.selectedOptions && item.selectedOptions[group.id] === opt);
                              return (
                                <button
                                  key={opt}
                                  className={`option-chip ${isSelected ? 'active' : ''}`}
                                  onClick={() => handleToggleOption(item, group.id, opt)}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
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
          disabled={isSubmitting || orderItems.length === 0}
        >
          {isSubmitting ? '送出中...' : `確認送出 $${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
