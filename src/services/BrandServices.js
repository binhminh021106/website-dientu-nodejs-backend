const { Brand } = require('../models');
const { Op } = require('sequelize');

const BrandService = {
    // 1. Lấy tất cả thương hiệu
    getAll: async (includeDeleted = false) => {
        return await Brand.findAll({
            paranoid: !includeDeleted,
            order: [['id', 'DESC']],
        });
    },

    // 2. Lấy thương hiệu theo id
    getById: async (id, includeDeleted = false) => {
        return await Brand.findByPk(id, {
            paranoid: !includeDeleted,
        });
    },

    // 3. Thêm thương hiệu
    create: async (brandData) => {
        const newBrand = await Brand.create(brandData);
        return newBrand.id;
    },

    // 4. Sửa thương hiệu
    update: async (id, data) => {
        const [affectedRows] = await Brand.update(data, {
            where: { id: id },
        });
        return affectedRows > 0;
    },

    // 5. Xóa thương hiệu
    delete: async (id) => {
        const affectedRows = await Brand.destroy({
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

        const brand = await Brand.findOne({
            where: whereCondition,
        });

        return !!brand;
    },
};

module.exports = BrandService;