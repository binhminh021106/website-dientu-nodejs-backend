const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Tên sản phẩm không được để trống" },
        notEmpty: { msg: "Tên sản phẩm không được để trống" },
      },
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    category_id: DataTypes.INTEGER,
    brand_id: DataTypes.INTEGER,
    short_description: DataTypes.TEXT,
    description: DataTypes.TEXT,
    thumbnail_image: DataTypes.STRING,
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
);

module.exports = Product;
