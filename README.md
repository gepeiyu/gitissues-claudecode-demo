# gitissues-claudecode-demo

演示 Claude Code 基于 Issue 开发模式的项目。

## 项目简介

这是一个班级管理系统 API 项目，同时也是 Claude Code 基于 Issue 开发模式的演示项目。

**主要功能：**
- 用户管理 API (`/users`)
- 班级管理 API (`/classes`)
- 课程排座 API (`/classes/:id/schedules`)

**技术栈：**
- Node.js + Express
- Vitest + Supertest (测试)

## 核心工作流程

### Issue 工作流

1. **创建/编辑 Issue**
   - Claude 根据需求分析并生成 Issue 草稿
   - 展示给用户确认
   - 确认后执行 `gh issue create`

2. **实现 Issue**
   - 读取 Issue 完整内容
   - 制定实现计划并展示确认
   - 拉取最新代码，从 `main` 新建分支
   - 在 Issue 上发评论记录计划、分支名，标记为进行中
   - 实现功能
   - 完成后发第二条评论，标记为已完成

### PR 工作流

1. 从分支创建 PR，使用项目模板
2. 填入真实内容，包含 `Closes #<编号>`
3. 展示 PR 草稿给用户确认
4. 确认后执行 `gh pr create`

## CLAUDE.md 规范

### 1. 编码前先思考

- 不做假设，不隐藏困惑
- 有不确定时先提问，列出多种理解

### 2. Issue 工作流

**2a. 创建/编辑 Issue**
- 确认草稿前不得向 GitHub 写入
- 正文根据 issue 类型（Bug/功能/维护）组织

**2b. 实现 Issue**
- 先规划 → 发状态评论 → 再写代码
- 分支命名：`<类型>/issue-<编号>-<简短描述>`
  - 前缀：`feat/`、`fix/`、`chore/`、`docs/` 等
- 严禁直接向 `main` 提交

### 3. PR 工作流

- 使用项目模板，关联 issue
- 确认草稿后再创建
- 正文必须包含 `Closes #<编号>`

### 4. 简洁与外科手术式修改

- 用最少的代码解决问题，只碰必须碰的地方
- 不添加需求外的功能
- 不做投机性抽象
- 每一行改动都能追溯到当前 issue

## 开发示例

### 已完成的 Issue

- #1 实现 GET /users 用户列表接口
- #2 新增 POST /users 创建用户接口
- #4 用户模型增加年龄和性别字段，添加用户修改接口
- #5 添加班级接口，实现班级的添加和查询
- #8 给用户添加班级字段并支持按班级查询
- #9 课表管理功能
- #10 新增用户管理页面
- #11 班级管理页面
- #16 添加虚拟登录页面

### 分支命名示例

```
feat/issue-11-class-management
feat/issue-8-class-field
feat/issue-10-user-management-page
docs/issue-20-add-readme
```

### Git 历史示例

```
789db91 docs: update CLAUDE.md and rename PR template
e7f5dec Merge pull request #15 from gepeiyu/feat/issue-11-class-management
bbd5289 feat: complete class management (issue #11)
0506557 Merge pull request #14 from gepeiyu/feat/issue-8-class-field
6e0ed67 feat: add user management page (issue #10)
```

## 工具与配置

### Claude Code

项目使用 Claude Code 进行 AI 辅助开发，配置文件：
- `CLAUDE.md` - 项目级工作流规范

### GitHub CLI

常用命令：
```bash
# 创建 Issue
gh issue create --title "..." --label ... --body "..."

# 查看 Issue
gh issue view <编号>

# 评论 Issue
gh issue comment <编号> --body "..."

# 创建 PR
gh pr create --title "..." --body "..."
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务
npm start

# 开发模式
npm run dev

# 运行测试
npm test
```
