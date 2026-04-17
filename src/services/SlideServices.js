const { Slide } = require('../models');
const { Op } = require('sequelize');

const SlideService = {
    // 1. Lấy tất cả slide
    getAll: async (includeDeleted = false) => {
        return await Slide.findAll({
            paranoid: !includeDeleted,
            order: [['id', 'DESC']],
        });
    },
    // 2. Lấy slide theo id
    getById: async (id, includeDeleted = false) => {
        return await Slide.findByPk(id, {
            paranoid: !includeDeleted,
        });
    },
    // 3. Thêm slide
    create: async (slideData) => {
        const newSlide = await Slide.create(slideData);
        return newSlide.id;
    },
    // 4. Sửa slide
    update: async (id, data) => {
        const [affectedRows] = await Slide.update(data, {
            where: { id: id },
        });
        return affectedRows > 0;
    },
    // 5. Xóa slide
    delete: async (id) => {
        const affectedRows = await Slide.destroy({
            where: { id: id },
        });
        return affectedRows > 0;
    },
    // 6. Check trùng tên
    checkName: async (name, excludeId = null) => {
        const whereCondition = { name: name };

        if (excludeId) {
            whereCondition.id = { [Op.ne]: excludeId }; // Op.ne là Not Equal (!=)
        }

        const slide = await Slide.findOne({
            where: whereCondition,
        });

        return !!slide;
    },
};

module.exports = SlideService;