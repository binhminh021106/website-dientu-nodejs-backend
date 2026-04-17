const DataTypes = require("sequelize");
const sequelize = require("../config/database");

const Slide = sequelize.define(
  "Slide",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Tiêu đề banner không được để trống",
        },
        notEmpty: {
          msg: "Tiêu đề banner không được để trống",
        },
        len: {
          args: [3, 100],
          msg: "Tiêu đề banner phải từ 3 đến 100 ký tự",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Ảnh banner không được để trống",
        },
        notEmpty: {
          msg: "Ảnh banner không được để trống",
        },
      },
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "slides",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = Slide;
