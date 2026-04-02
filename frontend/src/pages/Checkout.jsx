import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItemTotalPrice, getOrderTotal } from '../utils/price';
import './Checkout.css';

const customizationGroups = [
  { id: 'spicy', label: '辣度', options: ['大辣', '中辣', '小辣'] },
  { id: 'onions', label: '蔥量', options: ['蔥多', '加蔥', '不加蔥'] },
  { id: 'rice',  label: '飯量', options: ['飯多+15', '飯少'] }
];

const Checkout = ({ userName, orderItems, onUpdateItem, onClearOrder }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = getOrderTotal(orderItems);

  const handleQtyChange = (item, newQuantity) => {
    onUpdateItem({ ...item, quantity: newQuantity });
  };

  const handleOptionChange = (item, groupId, opt) => {
    const prev = item.selectedOptions || {};
    const updated = { ...prev, [gid]: prev[gid] === opt ? null : opt };
    // Fixing variable names logic while keeping it clean
  };

  // Re-implementing the simpler, previous logic for "Reverting"
  const toggleOption = (item, groupId, opt) => {
    const prev = item.selectedOptions || {};
    const updated = { ...prev, [groupId]: prev[groupId] === opt ? null : opt };
    const remarkParts = customizationGroups.map(g => updated[g.id]).filter(Boolean);
    onUpdateItem({
      ...item,
      selectedOptions: updated,
      remark: remarkParts.join('、')
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbw0PRd07CmA2X83VS9fsUp75wnVC2t9IjDICi_s3kSskE_99WDqzqLcsjDRsbidpYBBLw/exec';
      const formattedItems = orderItems.map(item => {
        const itemTotal = getItemTotalPrice(item);
        return { ...item, price: itemTotal / item.quantity, total: itemTotal };
      });

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name: userName, items: formattedItems, totalAmount }),
      });

      // Do NOT clear order here, let success page show it first
      navigate('/success', { state: { orderItems: formattedItems } });
    } catch (err) {
      console.error(err);
      setErrorMsg('傳送失敗，請確認網路連線。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderItems.length === 0) {
    setTimeout(() => navigate('/menu'), 0);
    return null;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-40 font-body">
      <header className="w-full top-0 sticky z-50 bg-white border-b border-gray-100 flex items-center px-6 h-16 shadow-sm">
        <button onClick={() => navigate('/menu')} className="p-2 -ml-2 text-gray-800 active:scale-90 transition-transform">
          <span className="material-symbols-outlined font-bold">chevron_left</span>
        </button>
        <h1 className="flex-1 text-center pr-8 text-[19px] font-bold text-[#1a1a1a] font-headline">確認訂單</h1>
      </header>

      <div className="max-w-[480px] mx-auto px-5 py-8 flex flex-col gap-6">
        <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-50/50 flex justify-between items-center">
          <span className="text-[#a0a0a0] font-medium">訂購人</span>
          <div className="flex items-center gap-3">
            <span className="text-[#1a1a1a] font-bold text-lg">{userName}</span>
            <span className="material-symbols-outlined text-gray-300">person</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-1 mt-2">
          <span className="material-symbols-outlined text-[#d32f2f] text-[22px]">receipt_long</span>
          <h2 className="text-[19px] font-bold text-[#d32f2f]">訂單明細</h2>
        </div>

        <div className="flex flex-col gap-4">
          {orderItems.map((item) => (
            <div key={`${item.id}-${item.variantKey}`} className="bg-white rounded-[22px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-50/30 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[17px] font-bold text-[#1a1a1a]">{item.displayName}</h3>
                  <span className="text-[17px] font-bold text-[#d32f2f]">${getItemTotalPrice(item)}</span>
                </div>
                <div className="flex items-center bg-gray-50 rounded-full p-1.5 gap-3">
                  <button onClick={() => handleQtyChange(item, item.quantity - 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-sm font-black text-[#d32f2f]/60">remove</span>
                  </button>
                  <span className="font-bold text-[#1a1a1a] w-3 text-center">{item.quantity}</span>
                  <button onClick={() => handleQtyChange(item, item.quantity + 1)} className="w-8 h-8 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-sm font-black">add</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-3 border-t border-gray-50">
                {customizationGroups.map((group) => (
                  <div key={group.id} className="flex items-center gap-3 flex-wrap">
                    <span className="text-[12px] font-bold text-gray-400 w-8 shrink-0">{group.label}</span>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const isSelected = item.selectedOptions?.[group.id] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleOption(item, group.id, opt)}
                            className={`px-3 py-1.5 rounded-full text-[13px] font-bold transition-all duration-150 ${
                              isSelected ? 'bg-[#d32f2f] text-white shadow-md scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[22px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-50/30 flex justify-between items-center mt-2">
          <span className="text-gray-400 font-medium text-[15px]">總共 {orderItems.reduce((s, i) => s + i.quantity, 0)} 項商品</span>
          <div className="flex items-baseline gap-2">
            <span className="text-gray-400 text-[14px]">總金額</span>
            <span className="text-[22px] font-black text-[#d32f2f]">${totalAmount}</span>
          </div>
        </div>

        {errorMsg && <div className="bg-red-50 text-[#d32f2f] p-4 rounded-2xl text-center font-bold text-sm border border-red-100">{errorMsg}</div>}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-6 pb-8 border-t border-gray-100/50 flex justify-center z-[100]">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || orderItems.length === 0}
          className="w-full max-w-[440px] py-[18px] bg-[#d32f2f] text-white font-black text-[19px] rounded-full shadow-[0_8px_24px_rgba(211,47,47,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSubmitting ? '處理中...' : `確認送出 $${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
