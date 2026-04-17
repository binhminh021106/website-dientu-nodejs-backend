const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Hàm tạo cấu hình upload linh hoạt theo tên folder
 */
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
            // Đặt tên file để tránh trùng lặp: timestamp-tên-gốc
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    // Hàm lọc file: Chỉ cho phép các định dạng ảnh phổ biến
    const fileFilter = (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
        // Kiểm tra đuôi file
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        // Kiểm tra định dạng (mimetype)
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            // Trả về lỗi nếu không phải file ảnh
            cb(new Error('Định dạng file không hợp lệ! Chỉ chấp nhận ảnh (jpg, jpeg, png, gif, webp).'), false);
        }
    };

    return multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // Giới hạn tối đa 5MB mỗi file
        }
    });
};

module.exports = createUpload;