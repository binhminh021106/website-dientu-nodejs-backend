const path = require("path");
const fs = require('fs');
const SlideService = require('../../services/SlideServices');

const AdminSlidesController = {
    // Lấy toàn bộ slide
    index: async (req, res) => {
        try {
            const includeDeleted = req.query.include_deleted === 'true' || true;
            const slides = await SlideService.getAll(includeDeleted);
            res.status(200).json({
                success: true,
                data: slides,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // Lấy chi tiết slide
    show: async (req, res) => {
        try {
            const includeDeleted = req.query.include_deleted === 'true' || true;
            const slide = await SlideService.getById(req.params.id, includeDeleted);
            if (!slide) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy slide' });
            }
            res.status(200).json({ success: true, data: slide });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // Thêm slide
    store: async (req, res) => {
        try {
            const { name } = req.body;
            const slideData = req.body;
            const isExisted = await SlideService.checkName(name);
            if (isExisted) {
                return res.status(400).json({
                    success: false,
                    message: `Slide "${name}" đã tồn tại!`,
                });
            }
            if (req.file) {
                slideData.image = req.file.filename;
            }
            const newId = await SlideService.create(slideData);
            res.status(201).json({
                success: true,
                message: 'Tạo slide thành công',
                id: newId,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // Sửa slide
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            let updateData = { ...req.body };
            if (name) {
                const isExisted = await SlideService.checkName(name, id);
                if (isExisted) {
                    return res.status(400).json({
                        success: false,
                        message: `Tên slide "${name}" đã bị trùng với slide khác!`,
                    });
                }
            }
            // Xử lý riêng cho ảnh
            if (req.file) {
                updateData.image = req.file.filename;
                // Logic xóa ảnh cũ
                const oldSlide = await SlideService.getById(id);
                if (oldSlide && oldSlide.image) {
                    const oldPath = path.join(__dirname, '../../uploads/slides', oldSlide.image);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }
            // Nếu trường nào rỗng hoặc undefined, ta xóa nó đi để DB không bị ghi đè null
            Object.keys(updateData).forEach((key) => {
                if (updateData[key] === undefined || updateData[key] === '') {
                    delete updateData[key];
                }
            });
            const isUpdated = await SlideService.update(id, updateData);
            if (!isUpdated) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy slide để cập nhật',
                });
            }
            res.status(200).json({
                success: true,
                message: 'Cập nhật slide thành công',
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // Xoá slide
    destroy: async (req, res) => {
        try {
            const isDeleted = await SlideService.delete(req.params.id);
            if (!isDeleted) {
                return res.status(404).json({ success: false, message: 'Xóa thất bại' });
            }
            res.status(200).json({ success: true, message: 'Đã xóa slide vào thùng rác' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
};

module.exports = AdminSlidesController;