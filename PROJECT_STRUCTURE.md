# 项目目录结构

```
my_first_net/
├── config/
│   └── database.js          # 数据库配置文件
├── middleware/
│   └── auth.js              # JWT认证中间件
├── routes/
│   ├── auth.js              # 认证相关路由
│   └── courses.js           # 课程管理路由
├── config.env               # 环境配置文件
├── package.json             # 项目依赖配置
├── server.js                # 主服务器文件
├── test-api.js              # API测试脚本
├── start.bat                # Windows启动脚本
├── start.ps1                # PowerShell启动脚本
├── README.md                # 项目说明文档
└── PROJECT_STRUCTURE.md     # 项目结构说明
```

## 文件说明

### 核心文件
- **server.js** - Express服务器主文件，配置中间件和路由
- **config/database.js** - MySQL数据库连接配置和初始化
- **middleware/auth.js** - JWT认证和权限验证中间件

### 路由文件
- **routes/auth.js** - 管理员登录和token验证接口
- **routes/courses.js** - 课程成绩的增删改查接口

### 配置文件
- **config.env** - 数据库连接、JWT密钥等环境配置
- **package.json** - Node.js项目依赖和脚本配置

### 工具文件
- **test-api.js** - 用于测试API接口的脚本
- **start.bat** - Windows批处理启动脚本
- **start.ps1** - PowerShell启动脚本

### 文档文件
- **README.md** - 完整的项目说明和API文档
- **PROJECT_STRUCTURE.md** - 项目结构说明

## 启动方式

### 方式1: 使用启动脚本
- Windows: 双击 `start.bat`
- PowerShell: 运行 `.\start.ps1`

### 方式2: 手动启动
```bash
# 安装依赖
npm install

# 启动服务
npm start

# 开发模式（自动重启）
npm run dev
```

## 端口配置
默认端口: 3000
可在 `config.env` 文件中修改 `PORT` 参数

## 数据库配置
数据库配置在 `config.env` 文件中，包括：
- 主机地址
- 端口号
- 用户名
- 密码
- 数据库名
