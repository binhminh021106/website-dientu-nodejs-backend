const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

// Lấy danh sách danh mục
router.get('/', CategoryController.index);

// Lấy chi tiết 1 danh mục
router.get('/:id', CategoryController.show);

// Thêm danh mục mớ
router.post('/', CategoryController.store);

// Cập nhật danh mục
router.put('/:id', CategoryController.update);

// Xóa danh mục 
router.delete('/:id', CategoryController.destroy);

module.exports = router;