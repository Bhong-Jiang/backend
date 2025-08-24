const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection, initDatabase } = require('./config/database');

// 加载配置文件到 process.env（在本地使用 config.env，部署时可通过 Render UI 设置环境变量）
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const PORT = process.env.PORT || 3000;

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 路由
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '课程成绩查询系统API服务',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses'
    }
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
async function startServer() {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 初始化数据库
    await initDatabase();
    
    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log(`服务器启动成功!`);
      console.log(`服务地址: http://localhost:${PORT}`);
      console.log(`API文档: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();
