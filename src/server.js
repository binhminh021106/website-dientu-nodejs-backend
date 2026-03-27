const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const category = require("./routes/CategoryRoute");
const brand = require("./routes/BrandRoute")

// Khai báo đường dẫn Api gốc
app.use('/api/category', category);
app.use('/api/brand', brand);

app.use((req, res) => {
    res.status(404).json({ message: "Đường dẫn không tồn tại!" });
});

// --- KHỞI CHẠY SERVER ---
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});