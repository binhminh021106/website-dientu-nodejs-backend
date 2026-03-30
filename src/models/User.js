const db = require("../config/database");

const User = {
  // Lấy tất cả người dùng
  getAll: async () => {
    const sql = `
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NULL
      ORDER BY u.id DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  // Lấy chi tiết người dùng
  findById: async (id) => {
    const sql = `
      SELECT u.id, u.name, u.email, u.phone, u.status, u.created_at, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ? AND u.deleted_at IS NULL
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  // Tìm người dùng bằng Email
  findByEmail: async (email) => {
    const sql = `
      SELECT u.*, r.name as role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.email = ?
    `;
    const [rows] = await db.query(sql, [email]);
    return rows[0];
  },

  // Tìm bằng ID
  findById: async (id) => {
    const sql = `
      SELECT u.id, u.name, u.email, u.created_at, r.name as role 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  // Tạo người dùng mới
  create: async (userData) => {
    const { name, email, phone, image, gender, date_of_birth, password, role_id = 2, status = 1 } = userData;
    const sql =
      "INSERT INTO users (name, email, phone, image, gender, date_of_birth, password, role_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [
      name,
      email,
      phone,
      image, 
      gender,
      date_of_birth,
      password,
      role_id,
      status,
    ]);
    return result.insertId;
  },

  // Sửa người dùng
  update: async (id, data) => {
    const keys = Object.keys(data);
    if (keys.length === 0) return true;

    // Tạo chuỗi "name = ?, phone = ?"...
    const queryParts = keys.map((key) => `${key} = ?`).join(", ");
    const values = Object.values(data);
    values.push(id);

    const sql = `UPDATE users SET ${queryParts} WHERE id = ? AND deleted_at IS NULL`;

    const [result] = await db.query(sql, values);
    return result.affectedRows > 0;
  },

  // 6. Xóa mềm người dùng
  delete: async (id) => {
    const now = new Date();
    const sql = "UPDATE users SET deleted_at = ? WHERE id = ?";
    const [result] = await db.query(sql, [now, id]);
    return result.affectedRows > 0;
  },

  // Check trùng email
  checkEmail: async () => {
    let sql = `SELECT * FROM users WHERE email = ? AND deleted_at is NULL`
  }
};

module.exports = User;
