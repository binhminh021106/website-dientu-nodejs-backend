const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Tên danh mục không được để trống",
        },
        notEmpty: {
          msg: "Tên danh mục không được để trống",
        },
        len: {
          args: [3, 100],
          msg: "Tên danh mục phải từ 3 đến 100 ký tự",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Ảnh danh mục không được để trống",
        },
        notEmpty: {
          msg: "Ảnh danh mục không được để trống",
        },
      },
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "categories",
    timestamps: true, // Tự động quản lý created_at, updated_at
    paranoid: true, // Bật Soft Deletes
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = Category;
