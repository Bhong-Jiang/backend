const mysql = require('mysql2/promise');
require('dotenv').config();

// 支持 DATABASE_URL 一键连接，也兼容分字段配置
let dbConfig;
if (process.env.DATABASE_URL) {
  dbConfig = process.env.DATABASE_URL;
} else {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'my_code',
    charset: 'utf8mb4',
    timezone: '+08:00',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功!');
    connection.release();
  } catch (error) {
    console.error('数据库连接失败:', error.message);
    process.exit(1);
  }
}

// 初始化数据库表
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // 检查并创建管理员用户
    const [adminUsers] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      ['admin']
    );
    
    if (adminUsers.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('jbh1314520..', 10);
      
      await connection.execute(
        'INSERT INTO users (username, password_hash, email, is_admin) VALUES (?, ?, ?, ?)',
        ['admin', hashedPassword, 'admin@example.com', true]
      );
      console.log('管理员用户创建成功');
    }
    
    connection.release();
  } catch (error) {
    console.error('初始化数据库失败:', error.message);
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase
};
