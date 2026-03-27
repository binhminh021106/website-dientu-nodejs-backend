const express = require("express");
const router = express.Router();
const BrandController = require("../controllers/BrandController");
const uploadImage = require("../middleware/upload");

const upload = uploadImage("brands");

// Lấy danh sách danh mục
router.get("/", BrandController.index);

// Lấy chi tiết 1 danh mục
router.get("/:id", BrandController.show);

// Thêm danh mục mớ
router.post("/", upload.single("image"), BrandController.store);

// Cập nhật danh mục
router.put("/:id", upload.single("image"), BrandController.update);

// Xóa danh mục
router.delete("/:id", BrandController.destroy);

module.exports = router;
