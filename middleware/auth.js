const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// 读取JWT密钥
const envPath = path.join(__dirname, '..', 'config.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    envVars[key.trim()] = value.trim();
  }
});

const JWT_SECRET = envVars.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';

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
