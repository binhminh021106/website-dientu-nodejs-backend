const db = require("../config/database");

const Brand = {
  // Lấy tất cả thương hiệu
  getAll: async (includeDeleted = false) => {
    let sql = `SELECT * FROM brands`;

    if (!includeDeleted) {
      sql += " WHERE deleted_at IS NULL";
    }
    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql);
    return rows;
  },

  // Lấy thương hiệu theo id
  getById: async (id, includeDeleted = false) => {
    let sql = `SELECT * FROM brands WHERE id = ?`;

    if (!includeDeleted) {
      sql += " AND deleted_at IS NULL";
    }

    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  // Thêm thương hiệu
  create: async (brandData) => {
    const { name, description, image, status } = brandData;
    const sql =
      "INSERT INTO brands (name, description, image, status) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(sql, [name, description, image, status]);
    return result.insertId;
  },

  // Sửa thương hiệu
  update: async (id, data) => {
    // Lấy danh sách các cột cần sửa
    const keys = Object.keys(data); // Ví dụ: ['name', 'status']
    if (keys.length === 0) return true;

    // Tạo chuỗi SQL động: "name = ?, status = ?"
    const queryParts = keys.map((key) => `${key} = ?`).join(", ");

    // Chuẩn bị mảng giá trị tương ứng
    const values = Object.values(data); // Ví dụ: ['Tên mới', 1]
    values.push(id);

    const sql = `UPDATE brands SET ${queryParts} WHERE id = ?`;

    const [result] = await db.query(sql, values);
    return result.affectedRows > 0;
  },

  // Xoá thương hiệu
  delete: async (id) => {
    const now = new Date();
    const [result] = await db.query(
      "UPDATE brands SET deleted_at=? WHERE id = ?",
      [now, id],
    );
    return result.affectedRows > 0;
  },

  // Check trùng tên
  checkName: async (name, excludeId = null) => {
    let sql = "SELECT * FROM brands WHERE name = ? AND deleted_at IS NULL";
    const params = [name];

    if (excludeId) {
      sql += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.query(sql, params);
    return rows.length > 0;
  },
};

module.exports = Brand;
