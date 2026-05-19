#!/bin/bash
# setup.sh
# 项目初始化脚本，在仓库根目录运行一次
# 用法：bash setup.sh

set -e

echo "🚀 开始初始化项目配置..."

# ── Labels ──────────────────────────────────────────
echo ""
echo "📌 创建 Labels..."

# --force：同名已存在时覆盖，不报错
gh label create "feature"     --color "0075ca" --description "新功能"      --force
gh label create "bug"         --color "d73a4a" --description "Bug"          --force
gh label create "refactor"    --color "e4e669" --description "重构"         --force
gh label create "chore"       --color "cccccc" --description "杂项"         --force

gh label create "P0"          --color "b60205" --description "紧急，立即处理"    --force
gh label create "P1"          --color "e99695" --description "本 Sprint 必须完成" --force
gh label create "P2"          --color "f9d0c4" --description "下期"              --force

gh label create "in-progress" --color "0e8a16" --description "开发中"  --force
gh label create "blocked"     --color "e11d48" --description "被阻塞"  --force
gh label create "needs-triage"--color "eeeeee" --description "待分类"  --force

echo "✅ Labels 创建完成"

# ── Branch Protection（需要有 admin 权限）─────────────
echo ""
echo "🔒 配置分支保护规则..."

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${REPO}/branches/main/protection" \
  -f required_status_checks='{"strict":true,"contexts":["test"]}' \
  -f enforce_admins=false \
  -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  -f restrictions=null \
  2>/dev/null && echo "✅ 分支保护规则配置完成" \
  || echo "⚠️  分支保护规则需要 admin 权限，跳过（可在 GitHub Settings 手动配置）"

# ── 完成 ─────────────────────────────────────────────
echo ""
echo "✅ 初始化完成！"
echo ""
echo "接下来："
echo "  1. 把 project-templates/ 里的文件复制到项目根目录"
echo "  2. 修改 CLAUDE.md 中的项目名和技术栈"
echo "  3. 运行 claude 启动 Claude Code"
