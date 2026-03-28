const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/admin/AdminProductController");
const createUpload = require("../../middleware/upload");

const upload = createUpload("products");

// Route thêm sản phẩm
router.post("/", upload.single("thumbnail_image"), ProductController.store);

// Route lấy danh sách
router.get("/", ProductController.index);

// Route lấy chi tiết 1 sản phẩm
router.get("/:id", ProductController.show);

// Route sửa sản phẩm
router.put("/:id", upload.single("thumbnail_image"), ProductController.update);

// Route xoá sản phẩm
router.delete("/:id", ProductController.destroy);

module.exports = router;
