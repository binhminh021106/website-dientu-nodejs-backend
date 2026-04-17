const express = require("express");
const router = express.Router();
const AdminSlidesController = require("../../controllers/admin/AdminSlidesController");
const uploadImage = require("../../middleware/upload");

const upload = uploadImage("slides");

// Lấy danh sách slide
router.get("/", AdminSlidesController.index);

// Lấy chi tiết 1 slide
router.get("/:id", AdminSlidesController.show);

// Thêm slide mới
router.post("/", upload.single("image"), AdminSlidesController.store);

// Cập nhật slide
router.put("/:id", upload.single("image"), AdminSlidesController.update);

// Xóa slide
router.delete("/:id", AdminSlidesController.destroy);

module.exports = router;