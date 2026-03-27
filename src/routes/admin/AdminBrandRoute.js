const express = require("express");
const router = express.Router();
const AdminBrandController = require("../../controllers/admin/AdminBrandController");
const uploadImage = require("../../middleware/upload");

const upload = uploadImage("brands");

// Lấy danh sách danh mục
router.get("/", AdminBrandController.index);

// Lấy chi tiết 1 danh mục
router.get("/:id", AdminBrandController.show);

// Thêm danh mục mớ
router.post("/", upload.single("image"), AdminBrandController.store);

// Cập nhật danh mục
router.put("/:id", upload.single("image"), AdminBrandController.update);

// Xóa danh mục
router.delete("/:id", AdminBrandController.destroy);

module.exports = router;
