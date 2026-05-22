# Magnetique - 跨境电商冰箱贴独立站

基于 Next.js + Medusa.js 的全栈跨境电商平台，支持多语言、多货币，面向欧美市场的冰箱贴独立站。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| 后端 | Medusa.js (Node.js 电商引擎) |
| 数据库 | PostgreSQL 15 |
| 缓存 | Redis 7 |
| 搜索 | MeiliSearch |
| 支付 | Stripe / PayPal |
| 部署 | Vercel + Railway (推荐) |

## 项目结构

```
独立站搭建/
├── storefront/              # Next.js 前台 (用户端)
│   ├── app/[locale]/        # 国际化路由
│   │   ├── page.tsx         # 首页
│   │   ├── products/        # 产品列表/详情
│   │   ├── cart/            # 购物车
│   │   ├── checkout/        # 结算
│   │   ├── account/         # 用户中心
│   │   ├── about/           # 关于我们
│   │   ├── contact/         # 联系我们
│   │   └── custom-service/  # 定制服务
│   ├── components/          # UI 组件
│   │   ├── layout/          # 布局组件 (Header, Footer, Nav)
│   │   ├── product/         # 产品组件 (Card, Grid, Detail)
│   │   ├── cart/            # 购物车组件
│   │   ├── checkout/        # 结算组件
│   │   ├── account/         # 账户组件
│   │   └── ui/              # 通用 UI 组件
│   ├── lib/                 # 工具库
│   │   ├── medusa/          # Medusa API 客户端
│   │   ├── i18n/            # 国际化配置
│   │   └── utils/           # 工具函数
│   ├── store/               # Zustand 状态管理
│   ├── messages/            # 多语言翻译 (en/de/fr/es/it)
│   └── types/               # TypeScript 类型定义
│
├── medusa-backend/          # Medusa 后端
│   ├── src/
│   │   ├── api/             # 自定义 API
│   │   ├── services/        # 自定义服务
│   │   ├── subscribers/     # 事件订阅 (订单通知、库存预警)
│   │   └── seeders/         # 种子数据
│   ├── medusa-config.js     # Medusa 配置
│   └── .env                 # 环境变量
│
├── docker-compose.yml       # 本地开发环境 (PostgreSQL + Redis + MeiliSearch)
└── README.md
```

## 快速开始

### 前提条件

- Node.js >= 20
- Docker Desktop (用于 PostgreSQL、Redis、MeiliSearch)

### 1. 启动基础设施

```bash
docker compose up -d postgres redis meilisearch
```

### 2. 启动 Medusa 后端

```bash
cd medusa-backend
npm install
npm run migrate
npm run seed
npm run dev
```

后端运行在 http://localhost:9000
管理后台运行在 http://localhost:7000

### 3. 启动 Next.js 前台

```bash
cd storefront
npm install
npm run dev
```

前台运行在 http://localhost:3000

## 已实现的功能模块

### 前台 (用户端)

- [x] 首页 (Hero、推荐产品、分类展示、Newsletter)
- [x] 响应式导航 (PC/平板/手机自适应)
- [x] 多语言切换 (英语/德语/法语/西班牙语/意大利语)
- [x] 多货币切换 (USD/EUR/GBP/CAD/AUD)
- [x] 搜索功能 (关键词搜索、热门搜索词、搜索建议)
- [x] 产品列表页 (网格/列表切换、筛选、排序、分页、面包屑)
- [x] 产品详情页 (多图展示、变体选择、评分、评论、相关推荐)
- [x] 购物车 (增删改、优惠券、运费计算)
- [x] 结算流程 (地址管理、配送选择、支付选择、订单确认)
- [x] 用户中心 (仪表盘、订单管理、地址管理、收藏夹、优惠券、消息、设置)
- [x] 用户认证 (注册/登录/社交媒体登录)
- [x] 关于我们 / 联系我们 / 定制服务页面
- [x] 页脚 (链接、社交媒体、支付方式)

### 后台 (管理端)

- [x] Medusa Admin 内置管理面板
- [x] 产品管理 (CRUD、分类、变体、库存)
- [x] 订单管理 (状态流转、退款、发货)
- [x] 客户管理
- [x] 内容管理 (页面、博客、横幅)
- [x] 自定义库存预警订阅器
- [x] 自定义订单通知订阅器

## 部署

### 前端 (Vercel)

```bash
cd storefront
npx vercel --prod
```

### 后端 (Railway / Fly.io)

```bash
cd medusa-backend
# 使用 Railway dashboard 连接 GitHub 仓库自动部署
```

## 环境变量

### Medusa 后端 (`medusa-backend/.env`)

| 变量 | 说明 |
|------|------|
| DATABASE_URL | PostgreSQL 连接字符串 |
| REDIS_URL | Redis 连接字符串 |
| JWT_SECRET | JWT 签名密钥 |
| STRIPE_API_KEY | Stripe 支付密钥 |
| PAYPAL_CLIENT_ID | PayPal 客户端 ID |
| SENDGRID_API_KEY | SendGrid 邮件密钥 |
| MEILISEARCH_HOST | MeiliSearch 地址 |
| S3_* | AWS S3 文件存储 |

### Storefront (`storefront/.env.local`)

| 变量 | 说明 |
|------|------|
| NEXT_PUBLIC_MEDUSA_URL | Medusa 后端地址 |
| NEXT_PUBLIC_DEFAULT_LOCALE | 默认语言 |
| NEXT_PUBLIC_DEFAULT_CURRENCY | 默认货币 |

## 多语言支持

当前支持 5 种语言:
- 🇬🇧 English (`en`)
- 🇩🇪 Deutsch (`de`)
- 🇫🇷 Français (`fr`)
- 🇪🇸 Español (`es`)
- 🇮🇹 Italiano (`it`)

翻译文件位于 `storefront/messages/{locale}/common.json`
