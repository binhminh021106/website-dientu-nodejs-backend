const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Variant = sequelize.define(
  "Variant",
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "product_variants",
    timestamps: false,
  }
);

module.exports = Variant;