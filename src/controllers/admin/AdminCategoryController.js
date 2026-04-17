const path = require("path");
const fs = require("fs");
const CategoryService = require("../../services/CategoryServices");

const AdminCategoryController = {
  // 1. Lấy toàn bộ danh mục
  index: async (req, res) => {
    try {
      const includeDeleted = req.query.include_deleted === "true";

      const categories = await CategoryService.getAll(includeDeleted);
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 2. Lấy chi tiết 1 danh mục
  show: async (req, res) => {
    try {
      const includeDeleted = req.query.include_deleted === "true";

      const category = await CategoryService.getById(req.params.id, includeDeleted);
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
      const categoryData = req.body;
      const { name } = req.body;

      const isExisted = await CategoryService.checkName(name);
      if (isExisted) {
        return res.status(400).json({ success: false, message: `Danh mục "${name}" đã tồn tại!` });
      }

      if (req.file) {
        categoryData.image = req.file.filename;
      }

      const newId = await CategoryService.create(categoryData);
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
      const { name } = req.body;
      let updateData = { ...req.body };

      if (name) {
         const isExisted = await CategoryService.checkName(name, id);
         if (isExisted) {
           return res.status(400).json({ success: false, message: `Tên danh mục "${name}" đã trùng!` });
         }
      }

      // Xử lý riêng cho ảnh
      if (req.file) {
        updateData.image = req.file.filename;
        const oldCategory = await CategoryService.getById(id);
        if (oldCategory && oldCategory.image) {
          const oldPath = path.join(__dirname, "../../uploads/categories", oldCategory.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      // Xóa các trường rỗng
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined || updateData[key] === "") {
          delete updateData[key];
        }
      });

      const isUpdated = await CategoryService.update(id, updateData);
      if (!isUpdated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy danh mục để cập nhật" });
      }

      res.status(200).json({ success: true, message: "Cập nhật danh mục thành công" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // 5. Xóa danh mục
  destroy: async (req, res) => {
    try {
      const isDeleted = await CategoryService.delete(req.params.id);
      if (!isDeleted) {
        return res.status(404).json({ success: false, message: "Xóa thất bại (không tìm thấy ID)" });
      }
      res.status(200).json({ success: true, message: "Đã xóa danh mục vào thùng rác" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = AdminCategoryController;