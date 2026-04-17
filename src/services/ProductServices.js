const db = require("../config/database");

const Product = {
  // Lấy tất cả sản phẩm
  getAll: async (includeDeleted = false) => {
    let sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN brands b ON p.brand_id = b.id`;

    if (!includeDeleted) {
      sql += " WHERE p.deleted_at IS NULL";
    }
    sql += " ORDER BY p.id DESC";

    const [rows] = await db.query(sql);
    return rows;
  },

  // Lấy chi tiết 1 sản phẩm kèm mảng biến thể
  getById: async (id, includeDeleted = false) => {
    let sqlProduct = `SELECT * FROM products WHERE id = ?`;

    if (!includeDeleted) {
      sqlProduct += ` AND deleted_at IS NULL`;
    }

    const [products] = await db.query(sqlProduct, [id]);
    if (products.length === 0) return null;

    const product = products[0];

    // Gom các ID thuộc tính của biến thể thành 1 mảng JSON gọn gàng
    const sqlVariants = `
      SELECT pv.*, 
      (SELECT JSON_ARRAYAGG(attribute_value_id) FROM variant_attribute_values WHERE variant_id = pv.id) as attribute_value_ids
      FROM product_variants pv 
      WHERE pv.product_id = ?
    `;
    const [variants] = await db.query(sqlVariants, [id]);

    product.variants = variants;
    return product;
  },

  // Thêm sản phẩm (Sử dụng Transaction để đảm bảo tính toàn vẹn)
  create: async (productData, variantsData) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const {
        name,
        slug,
        category_id,
        brand_id,
        short_description,
        description,
        thumbnail_image,
      } = productData;
      const sqlProduct = `INSERT INTO products (name, slug, category_id, brand_id, short_description, description, thumbnail_image) VALUES (?, ?, ?, ?, ?, ?, ?)`;

      const [productResult] = await connection.query(sqlProduct, [
        name,
        slug,
        category_id,
        brand_id,
        short_description,
        description,
        thumbnail_image,
      ]);
      const newProductId = productResult.insertId;

      if (variantsData && variantsData.length > 0) {
        for (const variant of variantsData) {
          const sqlVariant = `INSERT INTO product_variants (product_id, sku, price, stock) VALUES (?, ?, ?, ?)`;

          const [variantResult] = await connection.query(sqlVariant, [
            newProductId,
            variant.sku,
            variant.price,
            variant.stock,
          ]);
          const newVariantId = variantResult.insertId;

          if (
            variant.attribute_value_ids &&
            variant.attribute_value_ids.length > 0
          ) {
            for (const attrValueId of variant.attribute_value_ids) {
              const sqlAttr = `INSERT INTO variant_attribute_values (variant_id, attribute_value_id) VALUES (?, ?)`;
              await connection.query(sqlAttr, [newVariantId, attrValueId]);
            }
          }
        }
      }

      await connection.commit();
      return newProductId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Sửa sản phẩm (Transaction)
  update: async (id, productData, variantsData) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Cập nhật thông tin cha
      if (Object.keys(productData).length > 0) {
        const fields = Object.keys(productData)
          .map((key) => `${key} = ?`)
          .join(", ");
        const values = Object.values(productData);
        values.push(id);

        const sqlProduct = `UPDATE products SET ${fields} WHERE id = ?`;
        await connection.query(sqlProduct, values);
      }

      // Giải pháp an toàn cho biến thể: Xoá toàn bộ biến thể cũ rồi thêm lại biến thể mới
      if (variantsData !== null) {
        await connection.query(
          `DELETE FROM product_variants WHERE product_id = ?`,
          [id],
        );

        if (variantsData.length > 0) {
          for (const variant of variantsData) {
            const sqlVariant = `INSERT INTO product_variants (product_id, sku, price, stock) VALUES (?, ?, ?, ?)`;
            const [variantResult] = await connection.query(sqlVariant, [
              id,
              variant.sku,
              variant.price,
              variant.stock,
            ]);
            const newVariantId = variantResult.insertId;

            if (
              variant.attribute_value_ids &&
              variant.attribute_value_ids.length > 0
            ) {
              for (const attrValueId of variant.attribute_value_ids) {
                const sqlAttr = `INSERT INTO variant_attribute_values (variant_id, attribute_value_id) VALUES (?, ?)`;
                await connection.query(sqlAttr, [newVariantId, attrValueId]);
              }
            }
          }
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Xoá mềm sản phẩm và huỷ liên kết ảnh
  delete: async (id) => {
    const sql =
      "UPDATE products SET deleted_at = NOW(), thumbnail_image = NULL WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Product;
