const db = require("../config/database");

const User = {
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
    const { name, email, phone, password, role_id = 2, status = 1 } = userData;
    const sql =
      "INSERT INTO users (name, email, phone, password, role_id, status) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [name, email, phone, password, role_id, status]);
    return result.insertId;
  },
};

module.exports = User;
