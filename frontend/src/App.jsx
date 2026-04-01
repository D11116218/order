import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import RestaurantSelection from './pages/RestaurantSelection';

function App() {
  const [userName, setUserName] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('chi-teng');

  const handleUpdateItem = (item) => {
    setOrderItems((prev) => {
      const existingItemIndex = prev.findIndex(i => i.id === item.id && i.variantKey === item.variantKey);
      
      if (existingItemIndex >= 0) {
        if (item.quantity === 0) {
          const newItems = [...prev];
          newItems.splice(existingItemIndex, 1);
          return newItems;
        } else {
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
            path="/restaurants" 
            element={
              userName ? (
                <RestaurantSelection setSelectedRestaurant={setSelectedRestaurant} onClearOrder={() => setOrderItems([])} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/menu" 
            element={
              userName ? (
                <Menu restaurantId={selectedRestaurant} orderItems={orderItems} onUpdateItem={handleUpdateItem} />
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
          <Route path="/success" element={<Success onClearOrder={clearOrder} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

