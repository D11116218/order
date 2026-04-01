import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantMenus } from '../data/menu';

const Menu = ({ restaurantId = 'chicken-honke', orderItems, onUpdateItem }) => {
  const navigate = useNavigate();
  const restaurant = restaurantMenus[restaurantId] || restaurantMenus['chicken-honke'];
  const { name: restaurantName, categories, items: menuItems } = restaurant;
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount  = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // variantKey uniquely identifies an item+variant combo in the cart
  const getQty = (id, variantKey) =>
    (orderItems.find(i => i.id === id && i.variantKey === variantKey) || {}).quantity || 0;

  const handleAdd = (menuItem, variantKey, price) => {
    const qty = getQty(menuItem.id, variantKey);
    const displayName = variantKey === 'alt' && menuItem.altLabel
      ? `${menuItem.name}（${menuItem.altLabel}）`
      : menuItem.name;
    onUpdateItem({ ...menuItem, price, variantKey, quantity: qty + 1, displayName });
  };

  const handleRemove = (menuItem, variantKey, price) => {
    const qty = getQty(menuItem.id, variantKey);
    if (qty <= 0) return;
    const displayName = variantKey === 'alt' && menuItem.altLabel
      ? `${menuItem.name}（${menuItem.altLabel}）`
      : menuItem.name;
    onUpdateItem({ ...menuItem, price, variantKey, quantity: qty - 1, displayName });
  };

  const QuantityControl = ({ item, variantKey, price }) => {
    const qty = getQty(item.id, variantKey);
    return (
      <div className="flex items-center gap-2">
        {qty > 0 && (
          <>
            <button
              onClick={() => handleRemove(item, variantKey, price)}
              className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant active:scale-90"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="font-headline font-bold text-on-surface w-4 text-center">{qty}</span>
          </>
        )}
        <button
          onClick={() => handleAdd(item, variantKey, price)}
          className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center text-primary active:scale-90"
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>
    );
  };

  const currentItems = menuItems[activeCategory] || [];

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-body pb-32">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 flex items-center px-6 h-[72px] sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="mr-4 text-gray-900 active:scale-90 transition-transform">
          <span className="material-symbols-outlined font-bold">chevron_left</span>
        </button>
        <h1 className="text-xl font-bold text-gray-900">產品訂購</h1>
      </header>

      {/* Category Tabs */}
      <nav className="bg-white border-b border-gray-100 sticky top-[72px] z-40 overflow-x-auto scrollbar-hide flex px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-4 text-base font-bold whitespace-nowrap transition-all relative ${
              activeCategory === cat.id ? 'text-[#d32f2f]' : 'text-gray-400'
            }`}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#d32f2f] rounded-t-full" />
            )}
          </button>
        ))}
      </nav>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        <div className="mb-4 px-1">
          <h2 className="text-[#888] text-sm uppercase tracking-wider font-bold">
            {categories.find(c => c.id === activeCategory)?.label}系列
          </h2>
        </div>

        {/* Menu Items List */}
        <div className="flex flex-col gap-3">
          {currentItems.flatMap(item => {
            const rowData = [];
            // If showAltOnly is set, we don't show the base price (standard version)
            if (!item.showAltOnly && item.price) {
              rowData.push({ ...item, displayName: item.name, price: item.price, variantKey: 'base' });
            }
            if (item.altPrice) {
              rowData.push({ ...item, displayName: `${item.name}(${item.altLabel})`, price: item.altPrice, variantKey: 'alt' });
            }
            return rowData;
          }).map((displayItem, idx) => (
            <div key={`${displayItem.id}-${displayItem.variantKey}`} className="bg-white rounded-[20px] p-5 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-gray-50/50">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[17px] font-bold text-[#1a1a1a]">{displayItem.displayName}</h3>
                  <span className="text-[17px] font-bold text-[#d32f2f]">${displayItem.price}</span>
                </div>
                {displayItem.variantKey === 'base' && displayItem.enName && <p className="text-xs text-gray-400 font-medium">{displayItem.enName}</p>}
              </div>

              <div className="flex items-center">
                {getQty(displayItem.id, displayItem.variantKey) > 0 ? (
                  <div className="flex items-center bg-gray-100/80 rounded-full p-1 gap-3">
                    <button 
                      onClick={() => handleRemove(displayItem, displayItem.variantKey, displayItem.price)}
                      className="w-8 h-8 bg-white text-[#d32f2f] rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-base font-black">remove</span>
                    </button>
                    <span className="font-bold text-gray-900 w-4 text-center">{getQty(displayItem.id, displayItem.variantKey)}</span>
                    <button 
                      onClick={() => handleAdd(displayItem, displayItem.variantKey, displayItem.price)}
                      className="w-8 h-8 bg-[#d32f2f] text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-base font-black">add</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAdd(displayItem, displayItem.variantKey, displayItem.price)}
                    className="w-10 h-10 bg-[#d32f2f] text-white rounded-full flex items-center justify-center shadow-lg shadow-red-100 active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined font-black">add</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Panel */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-lg bg-white rounded-3xl p-3 flex items-center justify-between shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-gray-100 z-[100]">
          <div className="flex items-center gap-4 ml-2">
            <div className="relative bg-red-50 p-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[#d32f2f] text-2xl">shopping_cart</span>
              <span className="absolute -top-1.5 -right-1.5 bg-[#d32f2f] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {totalCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">總計金額</span>
              <span className="text-xl font-black text-gray-900">${totalAmount}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-[#d32f2f] text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-red-100 active:scale-95 transition-all"
          >
            確認訂單
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
