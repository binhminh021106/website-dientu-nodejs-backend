const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Hàm tạo cấu hình upload linh hoạt theo tên folder
const createUpload = (folderName) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = `src/uploads/${folderName}/`;
            // Tự động tạo thư mục nếu chưa có
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            // Đặt tên: thời-gian-tên-gốc.jpg
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    return multer({ storage: storage });
};

module.exports = createUpload;