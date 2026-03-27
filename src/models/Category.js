const db = require("../config/database.js");

const Category = {
  // 1. Lấy tất cả danh mục
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE deleted_at is NULL ORDER BY id DESC",
    );
    return rows;
  },

  // 2. Tìm một danh mục theo ID
  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE id = ? AND deleted_at is NULL",
      [id],
    );
    return rows[0];
  },

  // 3. Thêm danh mục mới
  create: async (categoryData) => {
    const { name, description, parent_id, image, status } = categoryData;
    const sql =
      "INSERT INTO categories (name, description, parent_id, image, status) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [
      name,
      description,
      parent_id,
      image,
      status,
    ]);
    return result.insertId;
  },

  // 4. Cập nhật danh mục
  update: async (id, data) => {

    // Lấy danh sách các cột cần sửa
    const keys = Object.keys(data); // Ví dụ: ['name', 'status']
    if (keys.length === 0) return true; 

    // Tạo chuỗi SQL động: "name = ?, status = ?"
    const queryParts = keys.map((key) => `${key} = ?`).join(", ");

    // Chuẩn bị mảng giá trị tương ứng
    const values = Object.values(data); // Ví dụ: ['Tên mới', 1]
    values.push(id); 

    const sql = `UPDATE categories SET ${queryParts} WHERE id = ?`;

    const [result] = await db.query(sql, values);
    return result.affectedRows > 0;
  },

  // 5. Xóa danh mục
  delete: async (id) => {
    const now = new Date();
    const [result] = await db.query(
      "UPDATE categories SET deleted_at=? WHERE id = ?",
      [now, id],
    );
    return result.affectedRows > 0;
  },
};

module.exports = Category;
