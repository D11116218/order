import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Trash2, Edit2, Check, X, Download, Home, User, ShoppingBag, DollarSign } from 'lucide-react';
import { restaurantMenus } from '../data/menu';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editIdx, setEditIdx] = useState(null);
    const [editData, setEditData] = useState({});
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passError, setPassError] = useState(false);

    // Get Chi-Teng menu items for the dropdown
    const chiTengMenu = restaurantMenus['chi-teng'];
    const allMenuItems = [];
    Object.keys(chiTengMenu.items).forEach(catId => {
        chiTengMenu.items[catId].forEach(item => {
            allMenuItems.push({ name: item.name, price: item.price });
            if (item.altPrice) {
                allMenuItems.push({ name: `${item.name}(${item.altLabel})`, price: item.altPrice });
            }
        });
    });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbxApIzcf2wzbkAEUtYDJ2ka3c4P0wG5ZigOEVJquPIizhkuw-tRsEIZq5Kk-jV3r07Y/exec';
            const response = await fetch(apiUrl);
            const data = await response.json();
            // Data structure from GAS: [{ name, item, quantity, total, remark, rowNumber }]
            setOrders(data);
        } catch (err) {
            console.error(err);
            // alert('無法獲取訂單資料');
            // Mock data if fetch fails (for demonstration)
            setOrders([
                { name: '測試用戶', item: '極牛燒肉丼飯', quantity: 1, total: 130, remark: '', rowNumber: 2 },
                { name: '小明', item: '火山唐揚丼飯(大(加肉))', quantity: 2, total: 300, remark: '', rowNumber: 3 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === '54291981') {
            setIsAuthenticated(true);
            setPassError(false);
        } else {
            setPassError(true);
            setPassword('');
        }
    };

    const handleEdit = (idx) => {
        setEditIdx(idx);
        setEditData({ ...orders[idx] });
    };

    const handleCancel = () => {
        setEditIdx(null);
        setEditData({});
    };

    const getPriceByName = (name) => {
        const item = allMenuItems.find(i => i.name === name);
        return item ? item.price : 0;
    };

    const handleSaveRow = async (idx) => {
        setSaving(true);
        try {
            const basePrice = getPriceByName(editData.item);
            const isExtraRice = (editData.remark || '').includes('飯多+15');
            const updatedTotal = (basePrice + (isExtraRice ? 15 : 0)) * editData.quantity;
            
            const finalEditData = { ...editData, total: updatedTotal };

            const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbxApIzcf2wzbkAEUtYDJ2ka3c4P0wG5ZigOEVJquPIizhkuw-tRsEIZq5Kk-jV3r07Y/exec';
            
            await fetch(apiUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'updateRow',
                    rowIndex: finalEditData.rowNumber || (idx + 2),
                    data: finalEditData
                }),
            });

            const updatedOrders = [...orders];
            updatedOrders[idx] = finalEditData;
            setOrders(updatedOrders);
            setEditIdx(null);
            alert('修改成功');
        } catch (err) {
            console.error(err);
            alert('儲存失敗');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRow = async (idx) => {
        if (!window.confirm('確定要刪除這筆訂單嗎？')) return;
        
        setSaving(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbxApIzcf2wzbkAEUtYDJ2ka3c4P0wG5ZigOEVJquPIizhkuw-tRsEIZq5Kk-jV3r07Y/exec';
            
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
            alert('刪除成功');
        } catch (err) {
            console.error(err);
            alert('刪除失敗');
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadExcel = () => {
        if (orders.length === 0) return alert('目前無相關訂單');
        const headers = ['姓名', '餐點', '數量', '備註', '金額'];
        const csvRows = [headers.join(',')];
        orders.forEach(o => csvRows.push([`"${o.name}"`, `"${o.item}"`, o.quantity, `"${o.remark || ''}"`, o.total].join(',')));
        const blob = new Blob(["\ufeff" + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `訂單報表_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-overlay">
                <div className="login-card">
                    <div className="icon-wrap"><span className="material-symbols-outlined">lock</span></div>
                    <h2>管理員驗證</h2>
                    <p>請輸入 8 位數密碼以進入後台</p>
                    <form onSubmit={handlePasswordSubmit}>
                        <input 
                            type="password" 
                            placeholder="輸入密碼" 
                            className={passError ? 'error' : ''}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        {passError && <p className="error-text">密碼錯誤，請重新輸入</p>}
                        <button type="submit" className="login-btn">進入系統</button>
                    </form>
                    <button className="back-home-btn" onClick={() => navigate('/')}>返回首頁</button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-container bg-[#f8f9fa] min-h-screen">
            <header className="header-admin sticky top-0 bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    <button className="p-2 -ml-2 text-gray-700" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
                    <h1 className="text-[19px] font-bold text-gray-800">訂單管理 (後台)</h1>
                </div>
                <button className={`p-2 transition-all ${loading ? 'animate-spin' : ''}`} onClick={fetchOrders} disabled={loading}>
                    <RefreshCw size={20} className="text-gray-400" />
                </button>
            </header>

            <div className="admin-main max-w-[480px] mx-auto px-5 py-8 pb-40">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                        <RefreshCw size={32} className="animate-spin" />
                        <span className="font-medium">獲取最新訂單中...</span>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-medium italic">目前尚無訂單資料</div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order, idx) => (
                            <div key={idx} className="bg-white rounded-[24px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-50/50 flex flex-col gap-5">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                                    {editIdx === idx ? (
                                        <input 
                                            type="text" 
                                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-lg w-full mr-12"
                                            value={editData.name} 
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        />
                                    ) : (
                                        <h3 className="text-[19px] font-black text-gray-800">{order.name}</h3>
                                    )}
                                    
                                    <div className="flex items-center gap-2">
                                        {editIdx === idx ? (
                                            <>
                                                <button className="p-2 bg-green-50 text-green-600 rounded-full" onClick={() => handleSaveRow(idx)} disabled={saving}><Check size={18} /></button>
                                                <button className="p-2 bg-gray-50 text-gray-400 rounded-full" onClick={handleCancel}><X size={18} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="p-2 text-gray-300 hover:text-gray-500" onClick={() => handleEdit(idx)}><Edit2 size={18} /></button>
                                                <button className="p-2 text-gray-200 hover:text-red-400" onClick={() => handleDeleteRow(idx)} disabled={saving}><Trash2 size={18} /></button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 text-[15px]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-medium">餐點</span>
                                        {editIdx === idx ? (
                                            <select 
                                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-right max-w-[200px]"
                                                value={editData.item} 
                                                onChange={(e) => setEditData({...editData, item: e.target.value})}
                                            >
                                                {allMenuItems.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                            </select>
                                        ) : (
                                            <span className="font-bold text-gray-800">{order.item}</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 font-medium">數量</span>
                                        {editIdx === idx ? (
                                            <div className="flex items-center gap-3">
                                                <button className="w-8 h-8 rounded-full border border-gray-200 text-gray-400" onClick={() => setEditData({...editData, quantity: Math.max(1, editData.quantity - 1)})}>-</button>
                                                <span className="font-bold w-6 text-center">{editData.quantity}</span>
                                                <button className="w-8 h-8 rounded-full border border-gray-200 text-gray-400" onClick={() => setEditData({...editData, quantity: editData.quantity + 1})}>+</button>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-gray-800">{order.quantity} 份</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 font-medium">備註</span>
                                            {editIdx === idx ? (
                                                <div className="flex items-center gap-2">
                                                    <label className="flex items-center gap-1.5 cursor-pointer bg-red-50 px-2 py-1 rounded-md border border-red-100">
                                                        <input 
                                                            type="checkbox" 
                                                            className="w-4 h-4 accent-[#d32f2f]"
                                                            checked={(editData.remark || '').includes('飯多+15')}
                                                            onChange={(e) => {
                                                                let r = editData.remark || '';
                                                                if (e.target.checked) {
                                                                    if (!r.includes('飯多+15')) r = r ? `${r}、飯多+15` : '飯多+15';
                                                                } else {
                                                                    r = r.split('、').filter(s => s !== '飯多+15').join('、');
                                                                }
                                                                setEditData({...editData, remark: r});
                                                            }}
                                                        />
                                                        <span className="text-[12px] font-bold text-[#d32f2f]">飯多+15</span>
                                                    </label>
                                                    <input 
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-bold text-right max-w-[130px]"
                                                        value={editData.remark || ''} 
                                                        onChange={(e) => setEditData({...editData, remark: e.target.value})}
                                                        placeholder="其他備註"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="font-bold text-gray-400 italic text-[13px]">{order.remark || '無'}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                                        <span className="text-gray-400 font-medium">總額</span>
                                        <span className="text-[20px] font-black text-[#d32f2f]">
                                            ${editIdx === idx 
                                                ? (getPriceByName(editData.item) + ((editData.remark || '').includes('飯多+15') ? 15 : 0)) * editData.quantity 
                                                : order.total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white p-6 pb-10 border-t border-gray-100 flex flex-col items-center gap-4 z-[100]">
                <div className="flex gap-4 w-full max-w-[440px]">
                    <button className="flex-1 py-4 bg-[#2e7d32] text-white font-black rounded-full flex items-center justify-center gap-2 shadow-lg shadow-green-100" onClick={handleDownloadExcel}>
                        <Download size={20} /> 下載 Excel
                    </button>
                    <button className="flex-1 py-4 bg-[#d32f2f] text-white font-black rounded-full flex items-center justify-center gap-2 shadow-lg shadow-red-100" onClick={() => navigate('/')}>
                        <Home size={20} /> 返回首頁
                    </button>
                </div>
                <p className="text-gray-300 text-[11px] font-medium tracking-wider uppercase">※ 修改或刪除後將直接同步至 Google Sheets</p>
            </div>
        </div>
    );
};

export default Admin;
