const Product = require("../../models/Product");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");

const ProductController = {
  // Lấy toàn bộ sản phẩm
  index: async (req, res) => {
    try {
      const products = await Product.getAll();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy chi tiết 1 sản phẩm kèm biến thể
  show: async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm" });
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Thêm sản phẩm
  store: async (req, res) => {
    try {
      const productData = { ...req.body };

      if (req.file) {
        productData.thumbnail_image = req.file.filename;
      }

      if (productData.name) {
        productData.slug =
          slugify(productData.name, { lower: true, strict: true }) +
          "-" +
          Date.now();
      }

      let variantsData = [];
      if (req.body.variants) {
        try {
          variantsData = JSON.parse(req.body.variants);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Dữ liệu biến thể sai định dạng JSON",
          });
        }
      }

      const newId = await Product.create(productData, variantsData);

      res.status(201).json({
        success: true,
        message: "Tạo sản phẩm và các biến thể thành công",
        id: newId,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Sửa sản phẩm
  update: async (req, res) => {
    try {
      const { id } = req.params;
      let updateData = { ...req.body };

      // Đổi ảnh mới và xoá ảnh cũ vật lý
      if (req.file) {
        updateData.thumbnail_image = req.file.filename;

        const oldProduct = await Product.getById(id);
        if (oldProduct && oldProduct.thumbnail_image) {
          const oldPath = path.join(
            __dirname,
            "../../uploads/products",
            oldProduct.thumbnail_image,
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      if (updateData.name) {
        updateData.slug =
          slugify(updateData.name, { lower: true, strict: true }) +
          "-" +
          Date.now();
      }

      // Lọc bỏ trường rỗng và tách riêng variants ra khỏi mảng dữ liệu cha
      Object.keys(updateData).forEach((key) => {
        if (
          updateData[key] === undefined ||
          updateData[key] === "" ||
          key === "variants"
        ) {
          delete updateData[key];
        }
      });

      let variantsData = null;
      if (req.body.variants) {
        try {
          variantsData = JSON.parse(req.body.variants);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Dữ liệu biến thể sai định dạng JSON",
          });
        }
      }

      const isUpdated = await Product.update(id, updateData, variantsData);
      if (!isUpdated) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm" });
      }

      res
        .status(200)
        .json({ success: true, message: "Cập nhật sản phẩm thành công!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Xoá mềm sản phẩm và xoá ảnh vật lý
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy sản phẩm" });
      }

      if (product.thumbnail_image) {
        const filePath = path.join(
          __dirname,
          "../../uploads/products",
          product.thumbnail_image,
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      const isDeleted = await Product.delete(id);
      if (!isDeleted) {
        return res
          .status(400)
          .json({ success: false, message: "Xoá thất bại" });
      }

      res.status(200).json({ success: true, message: "Đã xoá sản phẩm" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = ProductController;
