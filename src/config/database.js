const { Sequelize } = require("sequelize");
require("dotenv").config();

// Khởi tạo Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || "dientu",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3310,
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Đã kết nối thành công với database");
  })
  .catch((err) => {
    console.error("Không thể kết nối tới database:", err);
  });

module.exports = sequelize;
