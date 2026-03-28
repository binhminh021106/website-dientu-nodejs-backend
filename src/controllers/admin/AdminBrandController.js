const path = require("path");
const fs = require("fs");
const Brand = require("../../models/Brand");

const AdminBrandController = {
  // Lấy toàn bộ thương hiệu
  index: async (req, res) => {
    try {
      const brands = await Brand.getAll();
      res.status(200).json({
        success: true,
        data: brands,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy chi tiết thương hiệu
  show: async (req, res) => {
    try {
      const brand = await Brand.getById(req.params.id);
      if (!brand) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy thương hiệu" });
      }
      res.status(200).json({ success: true, data: brand });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Thêm thương hiệu
  store: async (req, res) => {
    try {
      const { name } = req.body;
      const BrandData = req.body;

      const isExisted = await Brand.checkName(name);
      if (isExisted) {
        return res.status(400).json({
          success: false,
          message: `Thương hiệu "${name}" đã tồn tại!`,
        });
      }

      if (req.file) {
        BrandData.image = req.file.filename;
      }

      const newId = await Brand.create(BrandData);
      res.status(201).json({
        success: true,
        message: "Tạo thương hiệu thành công",
        id: newId,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Sửa thương hiệu
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      let updateData = { ...req.body };

      if (name) {
        const isExisted = await Brand.checkName(name, id);
        if (isExisted) {
          return res.status(400).json({
            success: false,
            message: `Tên thương hiệu "${name}" đã bị trùng với thương hiệu khác!`,
          });
        }
      }

      // Xử lý riêng cho ảnh
      if (req.file) {
        updateData.image = req.file.filename;

        // Logic xóa ảnh cũ
        const oldBrand = await Brand.getById(id);
        if (oldBrand && oldBrand.image) {
          const oldPath = path.join(
            __dirname,
            "../../uploads/brands",
            oldBrand.image,
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

      const isUpdated = await Brand.update(id, updateData);
      if (!isUpdated) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thương hiệu để cập nhật",
        });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật thương hiệu thành công",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Xoá thương hiệu
  destroy: async (req, res) => {
    try {
      const isDeleted = await Brand.delete(req.params.id);
      if (!isDeleted) {
        return res
          .status(404)
          .json({ success: false, message: "Xóa thất bại" });
      }
      res
        .status(200)
        .json({ success: true, message: "Đã xóa thương hiệu vào thùng rác" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = AdminBrandController;
