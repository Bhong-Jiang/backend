const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// 使用 dotenv 从 process.env 加载配置（部署平台应在环境变量中设置真实值）
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';

// 验证JWT token的中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '访问令牌缺失' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: '访问令牌无效或已过期' 
      });
    }
    
    req.user = user;
    next();
  });
};

// 验证管理员权限的中间件
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: '需要管理员权限' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
};
