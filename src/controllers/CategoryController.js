const Category = require('../models/Category');

const CategoryController = {
    // 1. Lấy toàn bộ danh mục
    index: async (req, res) => {
        try {
            const categories = await Category.getAll();
            res.status(200).json({
                success: true,
                data: categories
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 2. Lấy chi tiết 1 danh mục
    show: async (req, res) => {
        try {
            const category = await Category.getById(req.params.id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
            }
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 3. Tạo mới danh mục
    store: async (req, res) => {
        try {
            // Lấy dữ liệu từ body của Vue gửi lên
            const newId = await Category.create(req.body);
            res.status(201).json({
                success: true,
                message: "Tạo danh mục thành công",
                id: newId
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Lỗi khi tạo danh mục" });
        }
    },

    // 4. Cập nhật danh mục
    update: async (req, res) => {
        try {
            const isUpdated = await Category.update(req.params.id, req.body);
            if (!isUpdated) {
                return res.status(404).json({ success: false, message: "Cập nhật thất bại hoặc không có thay đổi" });
            }
            res.status(200).json({ success: true, message: "Cập nhật thành công" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // 5. Xóa danh mục (Soft Delete)
    destroy: async (req, res) => {
        try {
            const isDeleted = await Category.delete(req.params.id);
            if (!isDeleted) {
                return res.status(404).json({ success: false, message: "Xóa thất bại" });
            }
            res.status(200).json({ success: true, message: "Đã xóa danh mục vào thùng rác" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = CategoryController;