import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, RefreshCw, Trash2, Edit2, Check, X, Download, Home } from 'lucide-react';
import { menuData } from '../data/menu';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editIdx, setEditIdx] = useState(null);
    const [editData, setEditData] = useState({});

    // Flatten all menu items for the dropdown
    const allMenuItems = [
        ...menuData.mainDishes.map(item => item.name),
        ...menuData.mainDishes.map(item => `${item.name} (無配菜)`),
        ...menuData.sides.map(item => item.name),
        ...menuData.soups.map(item => item.name),
        ...menuData.drinks.map(item => item.name)
    ];

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbw0PRd07CmA2X83VS9fsUp75wnVC2t9IjDICi_s3kSskE_99WDqzqLcsjDRsbidpYBBLw/exec';
            const response = await fetch(apiUrl);
            const data = await response.json();
            const ordersWithId = data.map((order, idx) => ({ ...order, localId: idx }));
            setOrders(ordersWithId);
        } catch (err) {
            console.error(err);
            alert('無法獲取訂單資料');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleEdit = (idx) => {
        setEditIdx(idx);
        setEditData({ ...orders[idx] });
    };

    const handleCancel = () => {
        setEditIdx(null);
        setEditData({});
    };

    const getPriceByName = (name) => {
        let price = 0;
        menuData.mainDishes.forEach(dish => {
            if (dish.name === name) price = dish.price;
            if (`${dish.name} (無配菜)` === name) price = dish.noSidePrice;
        });
        menuData.sides.forEach(dish => { if (dish.name === name) price = dish.price; });
        menuData.soups.forEach(dish => { if (dish.name === name) price = dish.price; });
        menuData.drinks.forEach(dish => { if (dish.name === name) price = dish.price; });
        return price;
    };

    const handleSaveRow = async (idx) => {
        setSaving(true);
        try {
            const price = getPriceByName(editData.item);
            if (price > 0) {
                editData.total = price * editData.quantity;
            }

            const updatedOrders = [...orders];
            updatedOrders[idx] = { ...editData };
            
            const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbw0PRd07CmA2X83VS9fsUp75wnVC2t9IjDICi_s3kSskE_99WDqzqLcsjDRsbidpYBBLw/exec';
            
            await fetch(apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'updateRow',
                    rowIndex: editData.rowNumber || (idx + 2),
                    data: editData
                }),
            });

            setOrders(updatedOrders);
            setEditIdx(null);
            alert('修改已送出');
        } catch (err) {
            console.error(err);
            alert('儲存失敗');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRow = async (idx) => {
        if (!window.confirm('確定要刪除這筆資料嗎？')) return;
        
        setSaving(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbw0PRd07CmA2X83VS9fsUp75wnVC2t9IjDICi_s3kSskE_99WDqzqLcsjDRsbidpYBBLw/exec';
            
            await fetch(apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'deleteRow',
                    rowIndex: orders[idx].rowNumber || (idx + 2)
                }),
            });

            const updatedOrders = orders.filter((_, i) => i !== idx);
            setOrders(updatedOrders);
            alert('刪除已送出');
        } catch (err) {
            console.error(err);
            alert('刪除失敗');
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadExcel = () => {
        if (orders.length === 0) return alert('沒有資料可以下載');

        const headers = ['時間', '姓名', '餐點', '數量', '備註', '金額'];
        const csvRows = [headers.join(',')];

        orders.forEach(order => {
            const row = [
                `"${order.time || ''}"`,
                `"${order.name || ''}"`,
                `"${order.item || ''}"`,
                order.quantity,
                `"${order.remark || ''}"`,
                order.total
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = "\ufeff" + csvRows.join('\n'); // Add BOM for Excel UTF-8
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `訂單資料_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="admin-container page-enter-active">
            <header className="header">
                <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
                <h1>訂單管理 (後台)</h1>
                <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
                    <RefreshCw size={20} className={loading ? 'spinning' : ''} />
                </button>
            </header>

            <div className="admin-content">
                {loading ? (
                    <div className="loading-state">
                        <RefreshCw size={32} className="spinning text-secondary" />
                        <p>載入中...</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>姓名</th>
                                    <th>餐點</th>
                                    <th className="col-qty">數量</th>
                                    <th>備註</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, idx) => (
                                    <tr key={idx} className={editIdx === idx ? 'editing' : ''}>
                                        <td>
                                            {editIdx === idx ? (
                                                <input 
                                                    type="text" 
                                                    value={editData.name} 
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                />
                                            ) : (
                                                order.name
                                            )}
                                        </td>
                                        <td>
                                            {editIdx === idx ? (
                                                <select 
                                                    value={editData.item} 
                                                    onChange={(e) => handleInputChange('item', e.target.value)}
                                                >
                                                    {allMenuItems.map(item => (
                                                        <option key={item} value={item}>{item}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                order.item
                                            )}
                                        </td>
                                        <td className="col-qty">
                                            {editIdx === idx ? (
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    value={editData.quantity} 
                                                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                                                />
                                            ) : (
                                                order.quantity
                                            )}
                                        </td>
                                        <td>
                                            {editIdx === idx ? (
                                                <input 
                                                    type="text" 
                                                    value={editData.remark || ''} 
                                                    onChange={(e) => handleInputChange('remark', e.target.value)}
                                                />
                                            ) : (
                                                <span className="remark-text">{order.remark || '-'}</span>
                                            )}
                                        </td>
                                        <td className="actions">
                                            {editIdx === idx ? (
                                                <div className="action-btns">
                                                    <button className="save-btn" onClick={() => handleSaveRow(idx)} disabled={saving} title="儲存">
                                                        <Check size={18} />
                                                    </button>
                                                    <button className="cancel-btn" onClick={handleCancel} title="取消">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="action-btns">
                                                    <button className="edit-btn" onClick={() => handleEdit(idx)} title="修改">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button className="delete-btn" onClick={() => handleDeleteRow(idx)} disabled={saving} title="刪除">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="admin-actions-footer">
                <button className="footer-btn excel-btn" onClick={handleDownloadExcel}>
                    <Download size={20} /> 下載 Excel
                </button>
                <button className="footer-btn home-btn" onClick={() => navigate('/')}>
                    <Home size={20} /> 返回首頁
                </button>
            </div>
            
            <div className="admin-footer-tip">
                <p>※ 修改或刪除後將直接同步至 Google Sheets</p>
            </div>
        </div>
    );
};

export default Admin;
