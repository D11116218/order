import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, User, Trash2, Check, RefreshCw, PlusCircle, MinusCircle } from 'lucide-react';
import { getItemTotalPrice, getOrderTotal } from '../utils/price';
import './Checkout.css';

const customizationGroups = [
  { id: 'spicy', label: '辣度', options: ['大辣', '中辣', '小辣'] },
  { id: 'onions', label: '蔥量', options: ['蔥多', '加蔥', '不加蔥'] },
  { id: 'rice',  label: '飯量', options: ['飯多+15', '飯少'] }
];

const UserInfoCard = ({ userName }) => (
  <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex justify-between items-center transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
    <div className="flex flex-col gap-1">
      <span className="text-gray-400 font-medium text-[13px] uppercase tracking-wider">Ordering for</span>
      <span className="text-[#1a1a1a] font-black text-xl leading-none">{userName}</span>
    </div>
    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
      <User size={24} />
    </div>
  </div>
);

const OrderItemCard = ({ item, onUpdate }) => {
  const handleQty = (q) => onUpdate({ ...item, quantity: q });

  const toggleOpt = (gid, opt) => {
    const prev = item.selectedOptions || {};
    const updated = { ...prev, [gid]: prev[gid] === opt ? null : opt };
    const remarkParts = customizationGroups.map(g => updated[g.id]).filter(Boolean);
    onUpdate({ ...item, selectedOptions: updated, remark: remarkParts.join('、') });
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-black text-gray-800 leading-tight">{item.displayName}</h3>
          <span className="text-[19px] font-black text-[#d32f2f]">${getItemTotalPrice(item)}</span>
        </div>
        <div className="flex items-center bg-gray-50 rounded-full p-1.5 gap-4 border border-gray-100">
          <button onClick={() => handleQty(Math.max(0, item.quantity - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center active:scale-90 transition-transform">
            <MinusCircle size={18} className="text-[#d32f2f]/40" />
          </button>
          <span className="font-black text-gray-800 w-4 text-center">{item.quantity}</span>
          <button onClick={() => handleQty(item.quantity + 1)} className="w-8 h-8 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
            <PlusCircle size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-gray-50">
        {customizationGroups.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest pl-1">{group.label}</span>
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const isSel = item.selectedOptions?.[group.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => toggleOpt(group.id, opt)}
                    className={`px-4 py-2 rounded-xl text-[14px] font-bold transition-all duration-200 border ${
                      isSel ? 'bg-[#d32f2f] text-white border-[#d32f2f] shadow-lg shadow-red-50/50 scale-[1.03]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200 active:scale-95'
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
  );
};

const SummaryCard = ({ total, count }) => (
  <div className="bg-[#1a1a1a] rounded-[24px] p-7 shadow-[0_12px_40px_rgba(0,0,0,0.15)] flex justify-between items-center mt-4">
    <div className="flex flex-col gap-1">
      <span className="text-gray-500 font-bold text-[13px] uppercase tracking-wider">Subtotal ({count} items)</span>
      <span className="text-white font-black text-3xl tracking-tight">${total}</span>
    </div>
    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
      <Receipt size={32} />
    </div>
  </div>
);

const Checkout = ({ userName, orderItems, onUpdateItem, onClearOrder }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const total = getOrderTotal(orderItems);
  const count = orderItems.reduce((s, i) => s + i.quantity, 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErr('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbxApIzcf2wzbkAEUtYDJ2ka3c4P0wG5ZigOEVJquPIizhkuw-tRsEIZq5Kk-jV3r07Y/exec';
      const formatted = orderItems.map(o => ({ ...o, price: getItemTotalPrice(o) / o.quantity, total: getItemTotalPrice(o) }));
      await fetch(apiUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ name: userName, items: formatted, totalAmount: total }) });
      onClearOrder();
      navigate('/success', { state: { orderItems: formatted } });
    } catch (e) {
      console.error(e);
      setErr('傳送失敗，請確認網路連線。');
    } finally { setIsSubmitting(false); }
  };

  if (!userName || orderItems.length === 0) {
    if (userName) {
      setTimeout(() => navigate('/menu'), 0);
    } else {
      setTimeout(() => navigate('/'), 0);
    }
    return null;
  }

  return (
    <div className="bg-[#fcfcff] min-h-screen pb-40">
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-6 h-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-800 active:scale-90 transition-transform"><ChevronLeft size={28} /></button>
        <h1 className="flex-1 text-center pr-8 text-[20px] font-black text-gray-800 tracking-tight">Confirm Order</h1>
      </header>

      <div className="max-w-[480px] mx-auto px-6 py-8 flex flex-col gap-6">
        <UserInfoCard userName={userName} />
        <div className="flex flex-col gap-4">
          {orderItems.map((o) => (
            <OrderItemCard key={`${o.id}-${o.variantKey}`} item={o} onUpdate={onUpdateItem} />
          ))}
        </div>
        <SummaryCard total={total} count={count} />
        {err && <div className="p-4 bg-red-50 rounded-2xl text-[#d32f2f] text-center font-bold text-sm border border-red-100">{err}</div>}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg p-6 pb-10 border-t border-gray-100 flex justify-center z-[200]">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || orderItems.length === 0}
          className="w-full max-w-[440px] py-5 bg-[#d32f2f] text-white font-black text-[20px] rounded-[24px] shadow-[0_12px_40px_rgba(211,47,47,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
        >
          {isSubmitting ? <RefreshCw className="animate-spin" size={24} /> : <><span>Place Order</span><Check size={24} strokeWidth={3} /></>}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
