# KPOP 全球平台 - AI数据采集系统

> YOYO设计，2026-05-13

---

## 一、系统架构

```
全网来源                          数据处理                          网站展示
┌────────────┐                  ┌──────────────────┐              ┌───────────┐
│ Twitter/X  │ ──────┐          │                  │              │           │
├────────────┤      │          │  Agent 1: 抓取   │              │           │
│ Instagram  │ ─────┼─────────▶│  Agent 2: 翻译   │              │           │
├────────────┤      │          │  Agent 3: 识别   │─────────────▶│ Supabase  │
│ Weverse    │ ─────┤          │  Agent 4: SEO     │              │           │
├────────────┤      │          │                  │              │           │
│ Naver新闻  │ ─────┼─────────▶│                  │              │           │
├────────────┤      │          └──────────────────┘              └─────┬─────┘
│ 微博       │ ─────┘                                                      │
├────────────┤      │          ┌──────────────────┐                      │
│ 票务平台   │ ─────┼─────────▶│  Cron调度器       │ ──────────────────▶│  网站   │
│ (Interpark)│     │          │  每30分钟自动运行 │                      │
└────────────┘      │          └──────────────────┘                      │
                     │                                                       │
              原始数据▼                                                      ▼
```

---

## 二、数据来源清单

### 2.1 新闻类

| 来源 | 语言 | 类型 | 抓取方式 |
|-----|------|-----|---------|
| Naver新闻 | 韩文 | 娱乐新闻 | RSS / API |
| Naver TV | 韩文 | MV/综艺 | 页面爬虫 |
| 微博超话 | 中文 | 艺人动态 | 微博API |
| 腾讯娱乐 | 中文 | 娱乐新闻 | RSS |
| Allkpop | 英文 | 韩娱新闻 | RSS |
| Soompi | 英文 | 韩娱新闻 | RSS |

### 2.2 社交媒体

| 来源 | 语言 | 类型 | 抓取方式 |
|-----|------|-----|---------|
| Twitter/X | 多语言 | 官方公告 | Twitter API v2 |
| Instagram | 多语言 | 官方图文 | Instagram API |
| Weverse | 韩文 | 艺人发布 | Weverse API |
| TikTok | 多语言 | 短视频 | TikTok API |

### 2.3 票务平台

| 来源 | 语言 | 类型 | 抓取方式 |
|-----|------|-----|---------|
| Interpark | 韩文 | 演唱会票务 | 页面爬虫 |
| Yes24 | 韩文 | 演唱会票务 | 页面爬虫 |
| Ticketmelon | 泰文 | 东南亚票务 | API |

### 2.4 音乐平台

| 来源 | 语言 | 类型 | 抓取方式 |
|-----|------|-----|---------|
| Melon | 韩文 | 榜单/新歌 | 页面爬虫 |
| Genie | 韩文 | 榜单/新歌 | 页面爬虫 |
| QQ音乐 | 中文 | 榜单/新歌 | 页面爬虫 |

---

## 三、Agent实现方案

### Agent 1: 新闻抓取（News Crawler）

**技术选型：**
- 使用 `rss-parser` 抓取RSS源
- 使用 `playwright` 爬取动态页面
- 使用 Twitter/X API 抓取官方账号

**实现文件：** `agents/news-crawler/index.ts`

```typescript
interface CrawlerSource {
  name: string
  type: 'rss' | 'twitter' | 'webhook'
  url: string
  parser: (data: any) => NewsItem[]
}

// 支持的来源
const sources: CrawlerSource[] = [
  {
    name: 'Naver RSS',
    type: 'rss',
    url: 'https://rss.weather.com.cn/xml/naver/ent.xml',
    parser: parseNaverRSS
  },
  {
    name: 'Allkpop RSS',
    type: 'rss',
    url: 'https://www.allkpop.com/feed',
    parser: parseAllkpopRSS
  },
  // ... 更多来源
]
```

### Agent 2: AI翻译（Translator）

**技术选型：**
- MiniMax API（已有配置）
- 或 OpenAI GPT-4

**实现文件：** `agents/translator/index.ts`

```typescript
async function translateNews(item: NewsItem): Promise<TranslatedNews> {
  const prompt = `
你是一个专业的KPOP内容翻译专家。
请将以下${item.language}新闻翻译成中文：
- 标题简洁有力
- 摘要150字以内
- 保留专业术语英文（MV, CB, fandom等）

原文标题：${item.title}
原文内容：${item.content}
  `
  
  const response = await callMinimaxAPI(prompt)
  return parseAIResponse(response)
}
```

### Agent 3: 活动识别（Event Scanner）

**识别关键词：**

| 活动类型 | 韩文关键词 | 英文关键词 |
|---------|-----------|-----------|
| 演唱会 | 콘서트, 투어 | concert, tour |
| 签售会 | 팬사인회, 하이터치 | fansign, hi-touch |
| 快闪店 | 팝업스토어, 매장오프닝 | pop-up, store opening |
| 粉丝活动 | 팬미팅 | fanmeeting |
| 音乐节 | 페스티벌 | festival |

**实现文件：** `agents/event-scanner/index.ts`

### Agent 4: SEO生成（SEO Generator）

自动生成：
- meta_title（60字内）
- meta_description（160字内）
- tags（5-10个）
- slug

---

## 四、Cron调度计划

| Agent | 频率 | 时间 |
|-------|------|------|
| 新闻抓取 | 每30分钟 | 0,30分 |
| AI翻译 | 每15分钟 | 0,15,30,45分 |
| 活动识别 | 每小时 | 0分 |
| SEO生成 | 每小时 | 30分 |
| 热度更新 | 每日3:00 | 凌晨低峰期 |

---

## 五、技术实现路径

### 第一阶段：简单RSS抓取（本周）

```bash
# 安装依赖
npm install rss-parser axios cheerio

# 先抓取RSS源的新闻
# 验证数据流是否通
```

### 第二阶段：AI翻译集成（第二周）

```bash
# 配置MiniMax API
# 集成翻译Agent
# 测试翻译质量
```

### 第三阶段：高级爬虫（第三周）

```bash
# 安装playwright
npx playwright install

# 抓取动态页面（Twitter/Weverse）
```

### 第四阶段：自动化上线（第四周）

- 配置Cron jobs
- 监控数据质量
- 优化抓取效率

---

## 六、数据流程示例

```
1. 9:00 - Agent 1 抓取Naver新闻
   输入: https://news.naver.com/main/ranking/rankingday.nhn?type=ent
   输出: [{title: "...", content: "...", date: "2026-05-13"}]

2. 9:01 - Agent 2 翻译
   输入: 韩文新闻
   调用: MiniMax API
   输出: {title_zh: "...", summary: "...", tags: [...]}

3. 9:02 - Agent 3 检查活动
   输入: 翻译后的新闻
   判断: 是否包含演唱会/签售信息
   输出: 创建event记录

4. 9:03 - Agent 4 生成SEO
   输入: 完整新闻数据
   输出: {slug: "...", meta_title: "...", meta_description: "..."}

5. 9:04 - 写入Supabase
   写入news表
   发布到网站
```

---

## 七、下一步行动

### YOYO负责（本周）

1. [x] 数据库创建 ✅
2. [ ] 搭建新闻抓取Agent（先从RSS开始）
3. [ ] 配置Cron定时任务
4. [ ] 测试数据流

### 阿技负责（并行）

1. [ ] 创建GitHub仓库
2. [ ] 开发网站前端
3. [ ] 连接Supabase数据

### 阿韩负责

1. [ ] 整理热门艺人清单（Top 20）
2. [ ] 收集艺人官方SNS账号
3. [ ] 准备内容策略

---

## 八、技术文档位置

```
kpop-platform/
├── agents/
│   ├── news-crawler/
│   │   ├── index.ts       # 主程序
│   │   ├── sources/       # 各来源抓取器
│   │   └── utils/         # 工具函数
│   ├── translator/
│   │   └── index.ts
│   ├── event-scanner/
│   │   └── index.ts
│   └── seo-generator/
│       └── index.ts
└── docs/
    └── AI数据采集系统设计.md  ← 本文档
```

---

开始执行！