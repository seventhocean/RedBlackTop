# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RedBlackTop — 剧本杀玩家匿名论坛。无需注册登录，用户自设匿名昵称，在四个榜单板块（玩家红榜/黑榜、DM 红榜/黑榜）发布话题和评论，支持点赞和拉踩。

## Tech Stack

- **框架**: Next.js 16 (App Router, TypeScript)
- **数据库**: SQLite + Drizzle ORM + better-sqlite3
- **UI**: TailwindCSS v4 + shadcn/ui
- **部署**: Docker + docker-compose

## Development Commands

```bash
# 开发模式
npm run dev

# 生产构建（自动运行数据库迁移）
npm run build

# 启动生产服务器
npm run start

# 数据库
npm run db:generate    # 生成迁移
npm run db:migrate     # 运行迁移
npm run db:seed        # 初始化 4 个榜单数据

# 代码检查
npm run lint
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages & API routes
    api/                  # REST API endpoints
      topics/             # 话题 CRUD + 投票
      comments/           # 评论投票
      session/            # 匿名 session 管理
    board/[slug]/         # 榜单页
    topic/[id]/           # 话题详情页
  components/             # React components
    ui/                   # shadcn/ui primitives
  db/
    schema.ts             # Drizzle ORM schema (boards, topics, comments)
    index.ts              # DB connection (better-sqlite3)
    seed.ts               # 种子数据
drizzle/                  # 迁移文件
```

## Architecture Notes

- 匿名机制: 通过 `session_id` Cookie 标识用户，投票去重基于 Cookie
- 数据库文件路径: `data/redblacktop.db`，可通过 `DB_PATH` 环境变量配置
- 静态页面 (`/`) 在服务端直接查询数据库；动态页面通过 API routes 获取数据
- Docker 构建时会在 builder 阶段运行 `db:migrate` + `db:seed`，数据库文件嵌入镜像
