const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/admin/AdminProductController");
const createUpload = require("../../middleware/upload");
const { verifyToken, isAdmin } = require("../../middleware/AuthMiddleware");

const upload = createUpload("products");

// Route thêm sản phẩm
router.post("/", verifyToken, isAdmin, upload.single("thumbnail_image"), ProductController.store);

// Route lấy danh sách
router.get("/", verifyToken, isAdmin, ProductController.index);

// Route lấy chi tiết 1 sản phẩm
router.get("/:id", verifyToken, isAdmin, ProductController.show);
router.get("/:id", verifyToken, isAdmin, ProductController.show);

// Route sửa sản phẩm
router.put("/:id", verifyToken, isAdmin, upload.single("thumbnail_image"), ProductController.update);

// Route xoá sản phẩm
router.delete("/:id", verifyToken, isAdmin, ProductController.destroy);

module.exports = router;
