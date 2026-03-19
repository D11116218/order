import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';

function App() {
  const [userName, setUserName] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  const handleUpdateItem = (item) => {
    setOrderItems((prev) => {
      const existingItemIndex = prev.findIndex(i => i.id === item.id && i.isNoSide === item.isNoSide);
      
      if (existingItemIndex >= 0) {
        if (item.quantity === 0) {
          // Remove item
          const newItems = [...prev];
          newItems.splice(existingItemIndex, 1);
          return newItems;
        } else {
          // Update quantity/remark
          const newItems = [...prev];
          newItems[existingItemIndex] = item;
          return newItems;
        }
      } else {
        if (item.quantity > 0) {
          return [...prev, item];
        }
        return prev;
      }
    });
  };

  const clearOrder = () => {
    setOrderItems([]);
    setUserName('');
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home userName={userName} setUserName={setUserName} />} />
          <Route 
            path="/menu" 
            element={
              userName ? (
                <Menu orderItems={orderItems} onUpdateItem={handleUpdateItem} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/checkout" 
            element={
              userName && orderItems.length > 0 ? (
                <Checkout 
                  userName={userName} 
                  orderItems={orderItems} 
                  onUpdateItem={handleUpdateItem}
                  onClearOrder={clearOrder}
                />
              ) : (
                <Navigate to="/menu" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
