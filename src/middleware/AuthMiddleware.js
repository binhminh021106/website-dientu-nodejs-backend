const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {
  // Kiểm tra xem người dùng đã có Token chưa 
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Vui lòng đăng nhập để thực hiện chức năng này!" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Giải mã token xem có hợp lệ/hết hạn không
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Lưu thông tin giải mã (id, role) vào biến req để các controller phía sau sử dụng
      req.user = decoded; 
      next(); 
    } catch (error) {
      return res.status(403).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!" });
    }
  },

  // Kiểm tra xem có phải là Admin không 
  isAdmin: (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Bạn không có quyền Admin để thực hiện hành động này!" });
    }
    next(); 
  }
};

module.exports = authMiddleware;