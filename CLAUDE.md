# Project: [项目名]

## 技术栈
Node.js (ES Modules) + Express，测试：Vitest + Supertest

## 常用命令
```
npm run dev        # 开发服务器 port 3000
npm test           # 全量测试
npm run test:watch # 监视模式
```

## 目录结构
```
src/app.js         # Express 入口
src/routes/        # 路由（每个资源一个文件）
src/middleware/    # 中间件
tests/             # 测试文件（镜像 src/ 结构）
```

---

## 标准指令

以下指令有固定的执行流程，收到后按定义执行，不需要用户重复说明细节。

### "根据 Issue #N，生成实施计划"

输出以下四项，完成后等待确认，不要自动开始写代码：

1. **新增文件**：文件路径 + 内容概述
2. **修改文件**：文件路径 + 具体改动点
3. **测试用例列表**：
   - 正常路径（Happy Path）
   - 边界输入（空值、最大值、特殊字符）
   - 错误输入（非法参数、缺少字段、类型错误）
4. **潜在风险**：breaking change、性能影响、安全注意点

---

### "开始开发"

按以下顺序执行，每个阶段完成后汇报，等待确认再进入下一阶段：

**阶段一：准备**
```bash
git checkout -b feature/{issue-number}-brief-desc
gh issue comment {N} --body "🔄 开始开发，分支 feature/{issue-number}-brief-desc"
gh issue edit {N} --add-label "in-progress"
```

**阶段二：写测试**
- 按实施计划写测试文件，覆盖正常/边界/错误三类场景
- 运行 `npm test` 确认是 failing 状态
- 输出测试用例列表，等待确认

**阶段三：实现**（等确认后）
- 写实现代码，让测试通过
- 同一问题最多尝试 3 次，失败后暂停汇报（见"执行限制"）

**阶段四：验证**（测试全部通过后自动执行）
- 用 `gh issue view {N}` 读取验收标准
- 逐条比对，输出 ✓/✗ 结果
- 全部 ✓ 后提示"验证完成，可以提交"

---

### "提交"

按以下顺序执行：

```bash
git add .
git commit -m "{type}({scope}): {description}

Refs: #{N}"

git push origin {branch}

gh pr create \
  --title "{type}({scope}): {description}" \
  --body "## 关联 Issue
Closes #{N}

## 变更说明
{自动从 commits 提取}

## 测试
- [x] 覆盖正常路径
- [x] 覆盖边界输入
- [x] 覆盖错误输入
- [x] npm test 全部通过"

gh issue comment {N} --body "✅ PR #{pr-number} 已提交，等待 Review"
```

完成后输出 PR 链接。

---

### "Review PR #N"

按以下顺序检查，输出结构化的 Review 意见：

1. **安全**：权限校验、输入校验、敏感数据处理
2. **错误处理**：边界条件、异常路径是否覆盖
3. **测试覆盖**：是否覆盖三类场景，有无明显遗漏
4. **代码规范**：是否符合 CLAUDE.md 中的编码约定
5. **修改范围**：有无修改不相关的文件

每项输出：✓ 没问题 / ⚠️ 建议 / ❌ 必须修改

---

### "合并"

按以下顺序执行：

```bash
gh pr merge {N} --squash --delete-branch
gh issue view {issue-number}   # 确认 Issue 状态是 closed
```

输出：Issue 关闭状态确认、分支已删除。

---

## 修改边界

**非经明确要求，禁止修改：**
- `package.json`（不得新增/升级依赖）
- `.github/workflows/`（CI 配置）
- `.github/pull_request_template.md`
- `CLAUDE.md` 本身

**每次变更必须遵守：**
- 只修改与当前 Issue 直接相关的文件
- 不得重命名文件（除非 Issue 明确要求）
- 不得重构与当前 Issue 无关的代码
- 单个 PR diff 控制在 300 行以内
- 优先局部修改，不做整体重写

---

## 测试约束

**禁止以下行为（即使能让测试通过）：**
- 降低验收标准来让测试通过
- 删除或注释 failing 的测试用例
- 修改测试的期望值来配合有问题的实现
- 用 skip / only 跳过测试用例

---

## 执行限制

- 同一个问题最多尝试修复 3 次
- 连续失败 3 次后必须停下来汇报：
  - 当前错误是什么
  - 已尝试了哪些方法
  - 为什么没有解决
  - 我的判断和建议
- 不得自动安装系统级依赖（apt、brew 等）
- 不得自动修改 package.json 安装新包
- 不得删除测试文件来绕过错误

---

## 高风险操作：必须暂停等待确认

遇到以下任意一种情况，必须停下来汇报，等待明确的「可以」才能继续：

- 删除任何文件
- 修改 `package.json`
- 修改 CI/CD 配置
- 涉及权限校验、认证、鉴权的代码
- 涉及安全相关逻辑（加密、token、密码处理）
- 任何影响已有接口签名的修改（breaking change）

**暂停汇报格式：**
```
⚠️ 高风险操作
操作：[描述要做什么]
原因：[为什么需要这样做]
影响范围：[会影响哪些文件或功能]
等待确认...
```
