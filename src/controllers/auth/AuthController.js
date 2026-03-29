const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CHÚ Ý: Chuỗi bí mật này dùng để ký Token. Thực tế nên để trong file .env
const JWT_SECRET = process.env.JWT_SECRET;

const AuthController = {
  // Đăng ký tài khoản 
  register: async (req, res) => {
    try {
      const { name, email, phone, password, role, status } = req.body;

      // Kiểm tra email tồn tại
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email này đã được đăng ký!" });
      }

      // Mã hoá mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userRole = role || "user";

      const newUserId = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: userRole,
        status
      });

      res.status(201).json({ 
        success: true, 
        message: "Đăng ký thành công!", 
        userId: newUserId 
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Đăng nhập 
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Tìm user trong DB theo email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác!" });
      }

      // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hoá trong DB
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Email hoặc mật khẩu không chính xác!" });
      }

      // Tạo Token chứa ID và Quyền của user 
      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Trả về Token và thông tin cơ bản 
      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công!",
        token: accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = AuthController;