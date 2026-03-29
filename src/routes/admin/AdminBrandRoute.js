const express = require("express");
const router = express.Router();
const AdminBrandController = require("../../controllers/admin/AdminBrandController");
const uploadImage = require("../../middleware/upload");
const { verifyToken, isAdmin } = require("../../middleware/AuthMiddleware");

const upload = uploadImage("brands");

// Lấy danh sách danh mục
router.get("/", verifyToken, isAdmin, AdminBrandController.index);

// Lấy chi tiết 1 danh mục
router.get("/:id", verifyToken, isAdmin, AdminBrandController.show);

// Thêm danh mục mớ
router.post("/", verifyToken, isAdmin, upload.single("image"), AdminBrandController.store);

// Cập nhật danh mục
router.put("/:id", verifyToken, isAdmin, upload.single("image"), AdminBrandController.update);

// Xóa danh mục
router.delete("/:id", verifyToken, isAdmin, AdminBrandController.destroy);

module.exports = router;
