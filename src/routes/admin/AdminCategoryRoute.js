const express = require('express');
const router = express.Router();
const AdminCategoryController = require('../../controllers/admin/AdminCategoryController');
const uploadImage = require('../../middleware/upload');
const { verifyToken, isAdmin } = require("../../middleware/AuthMiddleware");

const upload = uploadImage('categories');

// Lấy danh sách danh mục
router.get('/', verifyToken, isAdmin, AdminCategoryController.index);

// Lấy chi tiết 1 danh mục
router.get('/:id', verifyToken, isAdmin, AdminCategoryController.show);

// Thêm danh mục mớ
router.post('/', verifyToken, isAdmin, upload.single('image'), AdminCategoryController.store);

// Cập nhật danh mục
router.put('/:id', verifyToken, isAdmin, upload.single('image'), AdminCategoryController.update);

// Xóa danh mục 
router.delete('/:id', verifyToken, isAdmin, AdminCategoryController.destroy);

module.exports = router;