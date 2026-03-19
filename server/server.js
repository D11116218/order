const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const excelFilePath = path.join(__dirname, 'orders.xlsx');

// 確保 Excel 檔案存在
const ensureExcelExists = () => {
    if (!fs.existsSync(excelFilePath)) {
        const wb = xlsx.utils.book_new();
        const wsData = [['姓名', '餐點', '數量', '總價', '備註']];
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        xlsx.utils.book_append_sheet(wb, ws, 'Orders');
        xlsx.writeFile(wb, excelFilePath);
    }
};

ensureExcelExists();

app.post('/api/orders', (req, res) => {
    try {
        const orderData = req.body;
        // orderData 預期格式： { name: '姓名', items: [{ name: '餐點', quantity: 1, price: 100, remark: '微辣' }], totalAmount: 100 }
        
        const wb = xlsx.readFile(excelFilePath);
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        // 為每個品項新增一列
        orderData.items.forEach(item => {
            data.push([
                orderData.name,
                item.name,
                item.quantity,
                item.price * item.quantity,
                item.remark || ''
            ]);
        });

        // 寫回檔案
        const newWs = xlsx.utils.aoa_to_sheet(data);
        wb.Sheets[wsName] = newWs;
        xlsx.writeFile(wb, excelFilePath);

        res.status(200).json({ success: true, message: '訂單新增成功' });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ success: false, message: '訂單新增失敗', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
