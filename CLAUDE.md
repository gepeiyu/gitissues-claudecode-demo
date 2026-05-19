# 项目说明

## 技术栈
- Node.js + Express (ES Modules)
- Vitest + Supertest (测试)

## 常用命令
```bash
npm start      # 启动服务
npm run dev    # 开发模式（自动重载）
npm test       # 运行测试
```

## 目录结构
```
├── src/
│   ├── app.js          # Express 应用
│   ├── server.js       # 服务启动入口
│   ├── routes/         # 路由
│   └── middleware/     # 中间件
├── tests/              # 测试文件
└── package.json
```

## 编码约定
- 使用 ES Modules (`import/export`)
- 测试文件命名：`*.test.js`，放在 `tests/` 目录

## GitHub Issues 操作方式
- **开工评论**：开始工作前在 Issue 下评论，说明开始处理
- **Refs 关联**：PR 描述中用 `Refs #issue-number` 关联相关 Issue
- **Closes 关闭**：PR 描述中用 `Closes #issue-number` 自动关闭 Issue
