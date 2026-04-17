const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Đây là bảng trung gian kết nối Biến thể với Giá trị thuộc tính
const VariantAttributeValue = sequelize.define(
  "VariantAttributeValue",
  {
    variant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    attribute_value_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "variant_attribute_values",
    timestamps: false,
  }
);

module.exports = VariantAttributeValue;