import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { menuData } from '../data/menu';
import './Menu.css';

const Menu = ({ orderItems, onUpdateItem }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('main');

  const categories = [
    { id: 'main', label: '主餐系列' },
    { id: 'sides', label: '美味單點' },
    { id: 'soups', label: '熱湯' },
    { id: 'drinks', label: '果漾果醋' }
  ];

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const getItemQuantity = (id, isNoSide = false) => {
    const item = orderItems.find(i => i.id === id && i.isNoSide === isNoSide);
    return item ? item.quantity : 0;
  };

  const handleUpdate = (menuItem, quantity, isNoSide = false) => {
    onUpdateItem({
      ...menuItem,
      price: isNoSide ? menuItem.noSidePrice : menuItem.price,
      isNoSide,
      quantity,
      displayName: isNoSide ? `${menuItem.name} (無配菜)` : menuItem.name
    });
  };

  const QuantityController = ({ item, isNoSide }) => {
    const quantity = getItemQuantity(item.id, isNoSide);
    return (
      <div className="quantity-control">
        {quantity > 0 && (
          <>
            <button 
              className="qty-btn remove" 
              onClick={() => handleUpdate(item, quantity - 1, isNoSide)}
            ><Minus size={16} /></button>
            <span className="qty-count">{quantity}</span>
          </>
        )}
        <button 
          className="qty-btn add" 
          onClick={() => handleUpdate(item, quantity + 1, isNoSide)}
        ><Plus size={16} /></button>
      </div>
    );
  };

  return (
    <div className="menu-container page-enter-active">
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
        <h1>美味點餐</h1>
      </header>

      <div className="category-tabs">
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="menu-list">
        {activeCategory === 'main' && menuData.mainDishes.map(item => (
          <div key={item.id} className="menu-item main-dish-card">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="en-name">{item.enName}</p>
            </div>
            
            <div className="variants">
              <div className="variant-row">
                <div className="variant-price">正常 <span>${item.price}</span></div>
                <QuantityController item={item} isNoSide={false} />
              </div>
              <div className="variant-row no-side">
                <div className="variant-price">無配菜 <span>${item.noSidePrice}</span></div>
                <QuantityController item={item} isNoSide={true} />
              </div>
            </div>
          </div>
        ))}

        {activeCategory === 'sides' && menuData.sides.map(item => (
          <div key={item.id} className="menu-item standard-card">
            <div className="item-info">
              <h3>{item.name}</h3>
              <span className="price">${item.price}</span>
            </div>
            <QuantityController item={item} isNoSide={false} />
          </div>
        ))}

        {activeCategory === 'soups' && menuData.soups.map(item => (
          <div key={item.id} className="menu-item standard-card">
            <div className="item-info">
              <h3>{item.name}</h3>
              <span className="price">${item.price}</span>
            </div>
            <QuantityController item={item} isNoSide={false} />
          </div>
        ))}

        {activeCategory === 'drinks' && menuData.drinks.map(item => (
          <div key={item.id} className="menu-item standard-card">
            <div className="item-info">
              <h3>{item.name}</h3>
              <span className="price">${item.price}</span>
            </div>
            <QuantityController item={item} isNoSide={false} />
          </div>
        ))}
      </div>

      {totalCount > 0 && (
        <div className="bottom-cart-bar">
          <div className="cart-summary">
            <div className="cart-icon-wrapper">
              <ShoppingCart size={24} />
              <span className="cart-badge">{totalCount}</span>
            </div>
            <div className="cart-total">
              <span className="total-label">總計</span>
              <span className="total-price">${totalAmount}</span>
            </div>
          </div>
          <button className="btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
            確認訂單
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
