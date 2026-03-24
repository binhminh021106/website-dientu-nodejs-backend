const db = require('../config/database.js');

const Category = {
    // 1. Lấy tất cả danh mục
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM categories WHERE deleted_at is NULL ORDER BY id DESC");
        return rows;
    },

    // 2. Tìm một danh mục theo ID
    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM categories WHERE id = ? AND deleted_at is NULL", [id]);
        return rows[0]; 
    },

    // 3. Thêm danh mục mới
    create: async (categoryData) => {
        const { name, description, parent_id, image, status } = categoryData;
        const sql = "INSERT INTO categories (name, price, description, parent_id, image, status) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await db.query(sql, [name, description, parent_id, image, status]);
        return result.insertId;
    },

    // 4. Cập nhật danh mục
    update: async (id, categoryData) => {
        const { name, description, parent_id, image, status } = categoryData;
        const sql = "UPDATE categories SET name=?, description=?, parent_id=?, image=?, status=? WHERE id=?";
        const [result] = await db.query(sql, [name, description, parent_id, image, status, id]);
        return result.affectedRows > 0;
    },

    // 5. Xóa danh mục
    delete: async (id) => {
        const now = new Date();
        const [result] = await db.query("UPDATE categories SET deleted_at=? WHERE id = ?", [now, id]);
        return result.affectedRows > 0;
    }   
};

module.exports = Category;