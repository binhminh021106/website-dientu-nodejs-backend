const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes Admin
const category = require("./routes/admin/AdminCategoryRoute");
const brand = require("./routes/admin/AdminBrandRoute");
const product = require("./routes/admin/AdminProductRoute");

// Khai báo đường dẫn Api gốc
app.use('/api/admin/category', category);
app.use('/api/admin/brand', brand);
app.use('/api/admin/product', product);

app.use((req, res) => {
    res.status(404).json({ message: "Đường dẫn không tồn tại!" });
});

// --- KHỞI CHẠY SERVER ---
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});