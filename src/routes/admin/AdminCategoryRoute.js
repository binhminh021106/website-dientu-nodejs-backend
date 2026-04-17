const express = require('express');
const router = express.Router();
const AdminCategoryController = require('../../controllers/admin/AdminCategoryController');
const uploadImage = require('../../middleware/upload');
// const { verifyToken, isAdmin } = require("../../middleware/AuthMiddleware");

const upload = uploadImage('categories');

// Lấy danh sách danh mục
router.get('/', AdminCategoryController.index);

// Lấy chi tiết 1 danh mục
router.get('/:id', AdminCategoryController.show);

// Thêm danh mục mớ
router.post('/', upload.single('image'), AdminCategoryController.store);

// Cập nhật danh mục
router.put('/:id', upload.single('image'), AdminCategoryController.update);

// Xóa danh mục 
router.delete('/:id', AdminCategoryController.destroy);

module.exports = router;