const { Category } = require("../models");
const { Op } = require("sequelize");

const CategoryService = {
  // 1. Lấy tất cả danh mục
  getAll: async (includeDeleted = false) => {
    return await Category.findAll({
      paranoid: !includeDeleted, // true: chỉ lấy chưa xoá, false: lấy cả đã xoá
      order: [["id", "DESC"]],
    });
  },

  // 2. Tìm một danh mục theo ID
  getById: async (id, includeDeleted = false) => {
    return await Category.findByPk(id, {
      paranoid: !includeDeleted,
    });
  },

  // 3. Thêm danh mục mới
  create: async (categoryData) => {
    const newCategory = await Category.create(categoryData);
    return newCategory.id;
  },

  // 4. Cập nhật danh mục
  update: async (id, data) => {
    const [affectedRows] = await Category.update(data, {
      where: { id: id },
    });
    return affectedRows > 0;
  },

  // 5. Xóa danh mục (Soft Delete)
  delete: async (id) => {
    const affectedRows = await Category.destroy({
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

    const category = await Category.findOne({
      where: whereCondition,
    });

    return !!category; 
  },
};

module.exports = CategoryService;