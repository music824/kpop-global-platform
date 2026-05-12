# KPOP 全球平台 - AI Agent 系统设计 v1.0

> 来源：金老师对话记录
> 创建时间：2026-05-13

---

## 一、Agent系统概览

我们的平台核心是**AI自动化**，而不是人工维护。

```
┌─────────────────────────────────────────────────────────────┐
│                    KPOP AI Agent 系统                        │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Agent 1     │    │ Agent 2     │    │ Agent 3     │     │
│  │ 新闻抓取    │───▶│ AI翻译      │───▶│ 活动识别    │     │
│  │             │    │             │    │             │     │
│  │ · 官方SNS   │    │ · 韩→中     │    │ · 演唱会    │     │
│  │ · 新闻网站  │    │ · 英→中     │    │ · 签售      │     │
│  │ · Weverse   │    │ · 日→中     │    │ · 快闪店    │     │
│  │ · Melon     │    │ · 自动摘要  │    │ · 品牌活动  │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │            │
│         ▼                  ▼                  ▼            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Supabase 数据库                       ││
│  │   artists | events | news | flash_news                 ││
│  └─────────────────────────────────────────────────────────┘│
│                          │                                  │
│         ┌────────────────┼────────────────┐                │
│         ▼                ▼                ▼                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Agent 4     │  │ Agent 5     │  │ Agent 6     │        │
│  │ SEO生成     │  │ 热度计算    │  │ 提醒推送    │        │
│  │             │  │             │  │             │        │
│  │ · 标题优化  │  │ · 热度指数  │  │ · 开票提醒  │        │
│  │ · 描述生成  │  │ · 趋势分析  │  │ · 活动提醒  │        │
│  │ · 标签生    │  │ · 排名更新  │  │ · 新闻推送  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、Agent 详细设计

### Agent 1: 新闻抓取（News Crawler）

**职责：** 从多个来源自动抓取KPOP相关新闻

**数据来源：**

| 来源 | 类型 | 频率 |
|-----|------|------|
| 官方SNS | Twitter/X, Instagram, Weverse, TikTok | 实时 |
| 官方公告 | 各事务所官网 | 实时 |
| 新闻网站 | Naver News, Daum, Sina, Sohu | 每30分钟 |
| 音乐平台 | Melon, Genie, Bugs | 每小时 |
| 票务平台 | Interpark, Yes24, Ticketmelon | 实时 |

**处理流程：**

```
1. 扫描各来源RSS/API
2. 去重（对比已有title+source_url）
3. 提取：title, content, author, publish_date, images
4. 写入 news 表（status: pending）
5. 触发 Agent 2 翻译
```

**技术实现：**

```typescript
// agents/news-crawler/index.ts
interface NewsSource {
  name: string;
  type: 'rss' | 'api' | 'scraper';
  url: string;
  parse: (raw: any) => NewsItem[];
}

class NewsCrawlerAgent {
  sources: NewsSource[];
  
  async run() {
    for (const source of this.sources) {
      try {
        const items = await this.fetch(source);
        for (const item of items) {
          await this.processItem(item);
        }
      } catch (error) {
        await this.logError('news_crawler', source.name, error);
      }
    }
  }
}
```

**Cron调度：** 每30分钟

---

### Agent 2: AI翻译（Translator）

**职责：** 将非中文内容翻译成中文，并生成摘要

**处理流程：**

```
1. 从 news 表读取 is_translated = false 的记录
2. 调用 AI API 翻译：
   - 标题：保留关键词，优化SEO
   - 内容：完整翻译
   - 摘要：生成150字摘要
3. 更新 news 表
4. 触发 Agent 3 活动识别
```

**AI Prompt 设计：**

```
你是一个专业的KPOP内容翻译专家。
请将以下韩文新闻翻译成中文，要求：
1. 标题简洁有力，包含关键词
2. 内容保持原意，专业术语保留英文（如：MV, CB, fandom name）
3. 摘要150字以内，包含核心信息

原文：[内容]
```

**支持语言：**

- 韩文 → 中文
- 英文 → 中文
- 日文 → 中文

**Cron调度：** 每15分钟（处理积压）

---

### Agent 3: 活动识别（Event Scanner）

**职责：** 从新闻和SNS中识别活动信息，自动创建事件

**识别规则：**

| 活动类型 | 关键词模式 |
|---------|----------|
| 演唱会 | 演唱会, Concert, TOUR, Arena |
| 签售会 | 签售, Fansign, Hi-touch |
| 快闪店 | Pop-up, 快闪, 展示, 体验馆 |
| 粉丝活动 | Fanmeeting, MMT, 见面会 |
| 音乐节 | Festival, Music Day |
| 颁奖礼 | Award, MAMA, MMA, Gayo |

**处理流程：**

```
1. 扫描 news 表中包含活动关键词的新记录
2. 提取：艺人、时间、地点、类型
3. 如果 event 表中已存在相似活动（同名+同日期），跳过
4. 否则创建新 event（status: pending_review）
5. 人工确认后发布
```

**去重逻辑：**

```sql
-- 检查是否已存在类似活动
SELECT * FROM events 
WHERE artist_id = $1 
  AND event_type = $2 
  AND ABS(event_date - $3) < INTERVAL '1 day';
```

**Cron调度：** 每小时

---

### Agent 4: SEO生成（SEO Generator）

**职责：** 为每条内容生成SEO友好的标题、描述、标签

**生成内容：**

| 字段 | 要求 |
|-----|------|
| meta_title | 60字符内，含关键词 |
| meta_description | 160字符内，含行动号召 |
| tags | 5-10个相关标签 |
| slug | URL友好的短标题 |

**示例：**

```
原标题：Stray Kids 5月世巡日程公开 首尔场票价公布
↓ AI SEO优化后
meta_title: Stray Kids 2026世巡完整日程｜首尔/东京/上海抢票攻略
meta_description: Stray Kids 2026世界巡回演唱会日程公开！包含首尔、东京、上海、香港等20+城市，点击查看票价及抢票时间。
tags: [Stray Kids, 世巡, 演唱会, 抢票, 2026]
slug: stray-kids-2026-world-tour-schedule
```

**Cron调度：** 每小时（处理新增内容）

---

### Agent 5: 热度计算（Hot Score Calculator）

**职责：** 计算并更新艺人/活动/新闻的热度指数

**热度算法：**

```
艺人热度 = 
  (新闻数量 × 3) + 
  (SNS互动 × 0.5) + 
  (搜索指数 × 2) + 
  (活动数量 × 5)
  - 时间衰减因子
```

**时间衰减因子：**

- 24小时内：× 1.0
- 48小时内：× 0.7
- 7天内：× 0.3
- 30天：× 0.1

**Cron调度：** 每日凌晨3点（低峰期）

---

### Agent 6: 提醒推送（Notifier）

**职责：** 检查即将到来的事件，向订阅用户发送提醒

**提醒类型：**

| 类型 | 触发时间 |
|-----|---------|
| 开票提醒 | 活动前24小时 |
| 活动提醒 | 活动前3小时 |
| 新闻提醒 | 关注艺人新动态 |

**推送方式：**

- 站内通知（数据库）
- 邮件（可选）
- 微信/飞书（可选）

**Cron调度：** 每小时

---

## 三、技术架构

### 3.1 Agent运行环境

使用 OpenClaw 的 `cron` + `sessions_spawn` 实现：

```typescript
// 每个Agent作为独立的 cron job 运行
const agentJobs = [
  {
    name: 'news-crawler',
    schedule: '*/30 * * * *',  // 每30分钟
    sessionTarget: 'isolated',
    payload: { kind: 'agentTurn', message: '执行新闻抓取...' }
  },
  {
    name: 'translator',
    schedule: '*/15 * * * *',  // 每15分钟
    sessionTarget: 'isolated',
    payload: { kind: 'agentTurn', message: '处理翻译队列...' }
  },
  // ...
];
```

### 3.2 错误处理和重试

```typescript
interface AgentConfig {
  maxRetries: 3;
  retryDelayMs: 60000;
  timeoutMs: 300000;  // 5分钟超时
  alertOnFailure: true;
}
```

### 3.3 日志和监控

每个Agent执行后记录到 `agent_logs` 表：

```sql
INSERT INTO agent_logs (
  agent_name, status, input_data, output_data,
  items_processed, items_created, duration_ms, started_at, completed_at
) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW());
```

---

## 四、数据流图

```
                    新闻来源
                       │
                       ▼
              ┌─────────────────┐
              │  Agent 1: 抓取  │
              │  - 去重         │
              │  - 格式化       │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   news 表       │
              │  (pending)      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Agent 2: 翻译  │
              │  - AI翻译       │
              │  - 生成摘要     │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │  news表  │ │ Agent 3  │ │ Agent 4  │
   │published │ │ 活动识别 │ │ SEO生成  │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        │            ▼            │
        │     ┌──────────┐        │
        │     │ events表 │        │
        │     │ pending  │        │
        │     └────┬─────┘        │
        │          │              │
        ▼          ▼              ▼
   ┌─────────────────────────────────┐
   │         前台网站展示             │
   └─────────────────────────────────┘
```

---

## 五、监控和告警

### 5.1 关键指标

| 指标 | 正常值 | 告警阈值 |
|-----|-------|---------|
| Agent执行成功率 | > 95% | < 80% |
| 新闻处理延迟 | < 30分钟 | > 2小时 |
| 翻译队列积压 | < 100条 | > 500条 |
| API调用失败率 | < 5% | > 20% |

### 5.2 告警方式

- 飞书机器人通知（失败时）
- 邮件摘要（每日）

---

## 六、MVP阶段Agent优先级

**Phase 1（MVP）：只做 Agent 1 + 2**

- MVP阶段先人工录入数据
- Agent 1（抓取）和 Agent 2（翻译）先做核心功能
- Agent 3-6 后续迭代

**Phase 2：完整实现所有Agent**

---

## 七、下一步

1. 确认Agent系统设计
2. 开始搭建Agent运行环境
3. 实现 Agent 1 新闻抓取（先从简单来源开始，如RSS）