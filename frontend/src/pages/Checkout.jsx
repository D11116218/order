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

const SummaryCard = ({ itemCount, totalAmount }) => (
  <div className="bg-white rounded-[22px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-50/30 flex justify-between items-center mt-2">
    <span className="text-gray-400 font-medium text-[15px] font-body">總共 {itemCount} 項商品</span>
    <div className="flex items-baseline gap-2">
      <span className="text-gray-400 text-[14px] font-body">總金額</span>
      <span className="text-[22px] font-black text-[#d32f2f] font-headline">${totalAmount}</span>
    </div>
  </div>
);

const Checkout = ({ userName, orderItems, onUpdateItem, onClearOrder }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = getOrderTotal(orderItems);
  const itemCount = orderItems.reduce((s, i) => s + i.quantity, 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbxApIzcf2wzbkAEUtYDJ2ka3c4P0wG5ZigOEVJquPIizhkuw-tRsEIZq5Kk-jV3r07Y/exec';
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

      navigate('/success', { state: { orderItems: formattedItems } });
    } catch (err) {
      console.error(err);
      setErrorMsg('傳送失敗，請確認網路連線。' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderItems.length === 0) {
    setTimeout(() => navigate('/menu'), 0);
    return null;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-40 font-body transition-colors duration-500">
      <header className="w-full top-0 sticky z-50 bg-white border-b border-gray-100 flex items-center px-6 h-16 shadow-sm">
        <button onClick={() => navigate('/menu')} className="p-2 -ml-2 text-gray-800 active:scale-90 transition-transform">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center pr-8 text-[19px] font-black text-[#1a1a1a] font-headline">確認訂單</h1>
      </header>

      <div className="max-w-[480px] mx-auto px-5 py-8 flex flex-col gap-6">
        <UserInfoCard userName={userName} />

        <div className="flex items-center gap-3 px-1 mt-2">
          <Receipt className="text-[#d32f2f]" size={22} />
          <h2 className="text-[19px] font-bold text-[#d32f2f] font-headline">訂單明細</h2>
        </div>

        <div className="flex flex-col gap-4">
          {orderItems.map((item) => (
            <OrderItemCard 
              key={`${item.id}-${item.variantKey}`} 
              item={item} 
              onUpdate={onUpdateItem} 
              customizationGroups={customizationGroups} 
            />
          ))}
        </div>

        <SummaryCard itemCount={itemCount} totalAmount={totalAmount} />

        {errorMsg && (
          <div className="bg-red-50 text-[#d32f2f] p-4 rounded-2xl text-center font-bold text-sm border border-red-100 flex items-center justify-center gap-2">
            <X size={16} /> {errorMsg}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-6 pb-8 border-t border-gray-100/50 flex justify-center z-[100] backdrop-blur-md bg-white/90">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || orderItems.length === 0}
          className="w-full max-w-[440px] py-[18px] bg-[#d32f2f] text-white font-black text-[19px] rounded-full shadow-[0_8px_32px_rgba(211,47,47,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : `確認送出 $${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
