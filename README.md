# 查询系统

这是一个完整的课程成绩查询系统，包含后端API服务和前端用户界面。

## 🚀 项目架构（后端部分）

- **后端**: Node.js + Express + MySQL
- **数据库**: MySQL 8.0+

## 📁 项目结构

```
my_first_net/
├── config/                 # 后端配置
├── middleware/             # 后端中间件
├── routes/                 # 后端路由
├── package.json            # 后端依赖
├── server.js               # 后端服务器
└── README.md               # 后端说明
```

## 🎯 功能特性

### 用户功能
- 课程成绩查询
- 模糊搜索支持（课程名称、代码、教学班、学院、学年、学期）
- 查询结果展示
- 响应式界面设计

### 管理员功能
- JWT认证登录
- 课程信息管理（增删改查）
- 数据统计展示（唯一课程数统计）
- 权限控制

## 🚀 快速启动

### 后端启动（仅后端）

```powershell
# 进入后端目录
cd my_first_net

# 安装依赖
npm install

# 启动后端服务
npm start
```

后端将在 `http://localhost:3000` 启动
如需前端代码，请访问 [前端仓库](https://github.com/Bhong-Jiang/frontend)。
前端请参见 `frontend/README.md` 获取前端启动与开发说明。
## 🌐 访问地址（后端）

- **后端API**: http://localhost:3000
- **API文档**: http://localhost:3000/api

## 🔐 管理员账号说明

- 本仓库不包含任何默认管理员密码。请使用环境变量 `ADMIN_PASSWORD` 在首次运行时创建管理员，或在部署后通过后台手动创建管理员用户。

## 📱 使用流程

### 用户查询流程
1. 访问首页 http://localhost:3001
2. 在搜索框输入课程相关信息，或选择学年和学期
3. 点击查询按钮
4. 查看查询结果和真实性验证

### 管理员操作流程
1. 访问 http://localhost:3001/login
2. 使用管理员账号登录
3. 进入管理后台
4. 进行课程信息的增删改查操作

## 🧪 测试说明

### 后端API测试
```bash
# 运行API测试脚本
node test-api.js
```

## 🔧 技术细节（后端）

- **框架**: Express.js
- **数据库**: MySQL2
- **认证**: JWT + bcryptjs
- **验证**: express-validator
- **跨域**: CORS

## 📊 数据库结构

### course_grades 表
- 课程名称、学年、学期
- 开课学院、课程代码、教学班
- 学分、成绩、成绩分项

### users 表
- 用户名、密码哈希、邮箱
- 管理员权限标识

## 🛡️ 安全特性

- 密码加密存储
- JWT token认证
- 输入数据验证
- SQL注入防护
- 权限控制

## 📋 开发说明

### 开发模式
- 后端: `npm run dev` (nodemon自动重启)
- 前端: `npm run dev` (Vite热重载)

### 生产构建
- 后端: `npm start`
- 前端: `npm run build`

## 🐛 常见问题

### 1. 数据库连接失败
- 检查MySQL服务是否启动
- 验证数据库连接信息
- 确认数据库和表已创建

### 2. 端口冲突
- 后端: 修改 `config.env` 中的PORT
- 前端: 修改 `vite.config.js` 中的端口

### 3. 依赖安装失败
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules
npm install
```

## 📚 相关文档

- [后端API文档](./README.md#api接口文档)
- [前端开发指南](./frontend/README.md)
- [Postman测试指南](./README.md#postman接口测试指南)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

---

## 🎉 开始使用（后端）

1. **启动后端**: 运行 `npm start`
2. **访问后端 API**: 打开 http://localhost:3000

**享受你的后端服务！** 🚀

## ⚙️ 环境变量与部署注意事项

- 本项目不会在仓库中保存真实凭据。请复制 `config.env.example` 为 `config.env`（仅用于本地开发），并填写真实的数据库连接信息与 `JWT_SECRET`。
- 在生产或部署平台（例如 Render）中，请在服务的 Environment / Secrets 设置中添加以下变量，不要把它们写入代码库：
	- DB_HOST
	- DB_PORT
	- DB_USER
	- DB_PASSWORD
	- DB_NAME
	- JWT_SECRET
	- PORT

- 如果你更喜欢使用单一连接字符串，请设置：
	- DATABASE_URL=mysql://user:password@host:port/dbname

### 部署后快速检测

- 我们添加了一个健康检查端点用于验证数据库连通性：
	- GET /health/db -> 返回 { success: true, message: 'database connection ok' } 或失败信息（仅包含非敏感错误消息）

### 如果凭据曾被泄露

- 立即在相应服务（如 Railway）中重置数据库密码并撤销旧凭据。
- 若需从 Git 历史中彻底删除敏感文件，请在确认后告知，我会提供 `bfg` 或 `git filter-repo` 的具体步骤。
"# backend" 
"# backend" 
"# backend" 
"# backend" 
"# backend" 
# backend
"# backend" 
"# backend" 
# backend
"# backend" 
