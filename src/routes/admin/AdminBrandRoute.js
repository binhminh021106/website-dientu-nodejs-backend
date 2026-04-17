const express = require("express");
const router = express.Router();
const AdminBrandController = require("../../controllers/admin/AdminBrandController");
const uploadImage = require("../../middleware/upload");
// const { verifyToken, isAdmin } = require("../../middleware/AuthMiddleware");

const upload = uploadImage("brands");

// Lấy danh sách thương hiệu
router.get("/", AdminBrandController.index);

// Lấy chi tiết 1 thương hiệu
router.get("/:id", AdminBrandController.show);

// Thêm thương hiệu mới
router.post("/", upload.single("image"), AdminBrandController.store);

// Cập nhật thương hiệu
router.put("/:id", upload.single("image"), AdminBrandController.update);

// Xóa thương hiệu
router.delete("/:id", AdminBrandController.destroy);

module.exports = router;
