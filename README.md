# KPOP Global Platform

AI驱动的全球KPOP实时活动与数据平台

## 🏗️ 技术栈

- **前端**: Next.js 15 + TypeScript + TailwindCSS
- **UI组件**: shadcn/ui
- **后端**: Supabase (PostgreSQL)
- **部署**: Vercel

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📁 项目结构

```
src/
├── app/                  # Next.js App Router 页面
│   ├── page.tsx        # 首页
│   ├── events/         # 活动页面
│   ├── artists/        # 艺人页面
│   ├── news/           # 新闻页面
│   └── map/            # 地图页面
├── components/         # React 组件
│   ├── ui/            # UI 基础组件
│   ├── layout/        # 布局组件
│   └── home/          # 首页组件
├── lib/               # 工具库
│   └── supabase/      # Supabase 客户端
└── hooks/             # React Hooks
```

## 🎨 设计风格

- **深色科技感**: 黑色背景 + 银色文字
- **KPOP活力**: 渐变紫/粉 (#8B5CF6 → #EC4899)
- **参考**: Apple + HYBE 官网风格

## 📝 开发说明

- 使用 TailwindCSS 进行样式开发
- 使用 shadcn/ui 组件库（按需引入）
- 使用 SWR 进行数据获取
- 支持 SSR 和客户端渲染

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/)
- [Supabase 文档](https://supabase.com/docs)
- [TailwindCSS 文档](https://tailwindcss.com/)

## License

MIT