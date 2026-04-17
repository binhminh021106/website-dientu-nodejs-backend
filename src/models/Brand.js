const DataTypes = require("sequelize");
const sequelize = require("../config/database");

const Brand = sequelize.define(
  "Brand",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Tên thương hiệu không được để trống",
        },
        notEmpty: {
          msg: "Tên thương hiệu không được để trống",
        },
        len: {
          args: [3, 100],
          msg: "Tên thương hiệu phải từ 3 đến 100 ký tự",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Ảnh thương hiệu không được để trống",
        },
        notEmpty: {
          msg: "Ảnh thương hiệu không được để trống",
        },
      },
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "brands",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = Brand;
