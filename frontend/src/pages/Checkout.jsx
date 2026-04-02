const UserInfoCard = ({ userName }) => (
  <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-50/50 flex justify-between items-center transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.05)]">
    <span className="text-[#a0a0a0] font-medium font-body">訂購人</span>
    <div className="flex items-center gap-3">
      <span className="text-[#1a1a1a] font-bold text-lg font-headline">{userName}</span>
      <span className="material-symbols-outlined text-gray-300">person</span>
    </div>
  </div>
);

const OrderItemCard = ({ item, onUpdate, customizationGroups }) => {
  const handleQtyChange = (newQty) => onUpdate({ ...item, quantity: newQty });

  const toggleOption = (groupId, opt) => {
    const prev = item.selectedOptions || {};
    const updated = { ...prev, [groupId]: prev[groupId] === opt ? null : opt };
    const remarkParts = customizationGroups.map(g => updated[g.id]).filter(Boolean);
    
    onUpdate({
      ...item,
      selectedOptions: updated,
      remark: remarkParts.join('、')
    });
  };

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-50/30 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[17px] font-bold text-[#1a1a1a] font-headline">{item.displayName}</h3>
          <span className="text-[17px] font-bold text-[#d32f2f] font-body">${getItemTotalPrice(item)}</span>
        </div>
        <div className="flex items-center bg-gray-50 rounded-full p-1.5 gap-3 border border-gray-100">
          <button onClick={() => handleQtyChange(item.quantity - 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center active:scale-90 transition-transform">
            <Plus className="rotate-45 text-[#d32f2f]/60" size={14} />
          </button>
          <span className="font-bold text-[#1a1a1a] w-3 text-center">{item.quantity}</span>
          <button onClick={() => handleQtyChange(item.quantity + 1)} className="w-8 h-8 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
            <Plus size={14} />
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
                    onClick={() => toggleOption(group.id, opt)}
                    className={`px-3 py-1.5 rounded-full text-[13px] font-bold transition-all duration-200 ${
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

  if (!userName || orderItems.length === 0) { setTimeout(() => navigate('/menu'), 0); return null; }

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
