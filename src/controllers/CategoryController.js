const path = require("path");
const fs = require("fs");
const Category = require("../models/Category");

const CategoryController = {
  // 1. Lấy toàn bộ danh mục
  index: async (req, res) => {
    try {
      const categories = await Category.getAll();
      res.status(200).json({
        success: true,
        data: categories,
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
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy danh mục" });
      }
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 3. Tạo mới danh mục
  store: async (req, res) => {
    try {
      const categoryData = req.body;

      if (req.file) {
        categoryData.image = req.file.filename;
      }

      const newId = await Category.create(categoryData);
      res.status(201).json({
        success: true,
        message: "Tạo danh mục thành công",
        id: newId,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 4. Cập nhật danh mục
  update: async (req, res) => {
    try {
      const { id } = req.params;
      let updateData = { ...req.body };

      // Xử lý riêng cho ảnh
      if (req.file) {
        updateData.image = req.file.filename;

        // Logic xóa ảnh cũ
        const oldCategory = await Category.getById(id);
        if (oldCategory && oldCategory.image) {
          const oldPath = path.join(
            __dirname,
            "../uploads/categories/",
            oldCategory.image,
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      // Nếu trường nào rỗng hoặc undefined, ta xóa nó đi để DB không bị ghi đè null
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined || updateData[key] === "") {
          delete updateData[key];
        }
      });

      // Gọi Model để cập nhật "thông minh"
      const isUpdated = await Category.update(id, updateData);

      res.status(200).json({
        success: true,
        message: "Cập nhật danh mục thành công",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 5. Xóa danh mục (Soft Delete)
  destroy: async (req, res) => {
    try {
      const isDeleted = await Category.delete(req.params.id);
      if (!isDeleted) {
        return res
          .status(404)
          .json({ success: false, message: "Xóa thất bại" });
      }
      res
        .status(200)
        .json({ success: true, message: "Đã xóa danh mục vào thùng rác" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = CategoryController;
