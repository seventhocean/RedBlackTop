# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RedBlackTop — 剧本杀玩家匿名论坛。无需注册登录，用户自设匿名昵称，在四个榜单板块发布话题和评论，支持点赞和拉踩。

## Tech Stack

- **框架**: Next.js 16 (App Router, TypeScript)
- **数据库**: SQLite + Drizzle ORM + better-sqlite3
- **UI**: TailwindCSS v4 + shadcn/ui
- **部署**: Docker + docker-compose

## Development Commands

```bash
npm run dev           # 开发模式
npm run build         # 生产构建（自动运行 db:migrate）
npm run start         # 启动生产服务器
npm run lint          # ESLint

# 数据库
npm run db:generate   # 生成迁移文件
npm run db:migrate    # 运行迁移
npm run db:seed       # 初始化 4 个榜单种子数据
```

## Architecture

### 匿名身份模型

- 每个用户由 `session_id` Cookie 标识（`anon_{timestamp}_{random}` 格式），有效期 1 年
- `POST /api/session` 检查已有 session_id，没有则创建新的并 Set-Cookie
- 用户自设的 `authorNickname` 只是展示名，无认证/去重功能
- 组件在发帖/评论前会先调用 `/api/session` 确保 Cookie 存在

### 投票去重

- 每个话题/评论的投票记录在独立 Cookie 中：`vote_topic_{id}` / `vote_comment_{id}`，值 `"up"` 或 `"down"`，30 天过期
- Vote API 读取 prevVote Cookie：如果是同方向则拒绝；如果已投过另一方向则先撤销旧票再投新票
- VoteButton 组件维护本地 optimistic state，通过 `onVote` 回调触发 API

### 组件渲染策略

| 页面 | 策略 | 原因 |
|------|------|------|
| `/` (首页) | Server Component | 直接 `await db.query.boards` |
| `/board/[slug]` | Server Component | 直接 `await db.query.boards` 查 board 元数据 |
| `/topic/[id]` | Client Component | 需要动态加载 topic + comments + 交互 |

- `TopicList`、`VoteButton`、`PostForm`、`CommentForm`、`CommentItem` 均为 Client Component

### 四个榜单

| slug | name | description |
|------|------|-------------|
| `player-red` | 玩家红榜 | 夸夸好玩家 |
| `player-black` | 玩家黑榜 | 避雷烂玩家 |
| `dm-red` | DM 红榜 | 神仙 DM 推荐 |
| `dm-black` | DM 黑榜 | 踩雷 DM 预警 |

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/session` | POST | 获取/创建匿名 session |
| `/api/topics?board=&sort=` | GET | 列表话题（sort: newest/hottest） |
| `/api/topics` | POST | 创建话题 |
| `/api/topics/[id]` | GET | 话题详情 + 评论列表 |
| `/api/topics/[id]` | POST | 创建评论 |
| `/api/topics/[id]/vote` | POST | 投票话题（body: {type: "up"\|"down"}） |
| `/api/comments/[id]/vote` | POST | 投票评论 |

### 数据库

- 文件路径：`data/redblacktop.db`，通过 `DB_PATH` 环境变量可配
- Drizzle Kit 配置在 `drizzle.config.ts`，直接指向 `./data/redblacktop.db`
- 表：`boards`（4 条种子数据）→ `topics`（board_id FK）→ `comments`（topic_id + parent_id FK，支持嵌套回复）
- 排序方式：`newest` = `ORDER BY created_at DESC`，`hottest` = `ORDER BY upvotes DESC`
- 频率限制：同一昵称每小时最多发 5 个 topic（`/api/topics` POST 中按 `authorNickname` + 1 小时窗口检查）

### 评论回复

- Schema 支持嵌套（`comments.parentId` 自引用），CommentForm 接受 `parentId` prop 并正确传给 API，`/api/topics/[id]` POST 也支持 `parentId`
- 话题页按 `parentId` 将评论分组为 root 和 replies，CommentItem 递归渲染子回复

### 已知问题

- `BoardCard` 组件未被任何页面使用（首页直接内联渲染了卡片）

### Docker

- `next.config.ts` 设置了 `output: "standalone"`
- 构建流程在 Dockerfile builder 阶段运行 `db:generate` + `db:migrate` + `db:seed`，数据库嵌入镜像
- 数据库路径在 `src/db/index.ts` 中硬编码为 `data/redblacktop.db`，可通过 `DB_PATH` 环境变量配置根目录

## 注意事项

- 项目无测试框架配置，如需添加测试需引入 vitest 或 jest
- `DESIGN.md` 是 BMW M 设计系统文档，不是本项目的设计规范
