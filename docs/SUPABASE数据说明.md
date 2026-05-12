# Supabase 数据说明文档

> 本文档说明如何将 mock 数据导入 Supabase 数据库

---

## 1. 数据表字段对照

### artists（艺人表）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | UUID | 主键，自生成 | `a1111111-1111-1111-1111-111111111111` |
| name_ko | VARCHAR(100) | 韩文名 | `방탄소년단` |
| name_zh | VARCHAR(100) | 中文名 | `防弹少年团` |
| name_en | VARCHAR(100) | 英文名 | `BTS` |
| group_name | VARCHAR(100) | 所属团体 | `BTS` |
| agency | VARCHAR(100) | 经纪公司 | `HYBE` |
| country | VARCHAR(50) | 国家 | `KR` |
| debut_date | DATE | 出道日期 | `2013-06-13` |
| profile_image | TEXT | 头像 URL | `https://...` |
| banner_image | TEXT | 横幅图片 URL | `null` |
| social_links | JSONB | 社交媒体链接 | `{"instagram":"...","twitter":"..."}` |
| artist_type | VARCHAR(20) | 类型：group/solo | `group` |
| member_count | INT | 成员数量 | `7` |
| tags | TEXT[] | 标签数组 | `["kpop","hip-hop"]` |
| status | VARCHAR(20) | 状态 | `active` |
| hot_score | INT | 热度分数 | `9850` |
| slug | VARCHAR(100) | URL 友好标识 | `bts` |

### events（活动表）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | UUID | 主键 | `e1111111-1111-1111-1111-111111111111` |
| title | VARCHAR(200) | 活动标题 | `BTS 2025 World Tour - Seoul` |
| subtitle | VARCHAR(200) | 副标题 | `BTS 5th Anniversary Concert` |
| artist_id | UUID | 关联艺人 ID | `a1111111-...` |
| event_type | VARCHAR(30) | 类型：concert/fanmeeting | `concert` |
| country | VARCHAR(50) | 国家 | `KR` |
| city | VARCHAR(100) | 城市 | `Seoul` |
| venue | VARCHAR(200) | 场馆 | `Olympic Stadium` |
| address | TEXT | 地址 | `Olympic-ro, Songpa-gu, Seoul` |
| latitude | DECIMAL(10,8) | 纬度 | `37.5208` |
| longitude | DECIMAL(11,8) | 经度 | `127.1214` |
| event_date | TIMESTAMPTZ | 活动开始时间 | `2025-06-15T19:00:00+09:00` |
| event_end_date | TIMESTAMPTZ | 活动结束时间 | `2025-06-15T22:00:00+09:00` |
| door_time | TIMESTAMPTZ | 入场时间 | `2025-06-15T17:00:00+09:00` |
| ticket_open_date | TIMESTAMPTZ | 开票时间 | `2025-03-01T10:00:00+09:00` |
| ticket_close_date | TIMESTAMPTZ | 停售时间 | `2025-06-10T23:59:00+09:00` |
| price_range | VARCHAR(100) | 价格区间 | `88000-220000` |
| currency | VARCHAR(10) | 货币单位 | `KRW` |
| official_link | TEXT | 官网链接 | `https://weverse.io/bts` |
| ticket_link | TEXT | 购票链接 | `https://ticket.interpark.com` |
| poster_image | TEXT | 海报图片 URL | `https://...` |
| status | VARCHAR(20) | 状态 | `ticketing` |
| is_highlighted | BOOLEAN | 是否精选 | `true` |
| hot_score | INT | 热度分数 | `9800` |
| source | VARCHAR(50) | 数据来源 | `interpark` |
| source_id | VARCHAR(100) | 来源 ID | `IP20250615` |
| slug | VARCHAR(100) | URL 友好标识 | `bts-2025-world-tour-seoul` |

### news（新闻表）

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | UUID | 主键 | `n1111111-1111-1111-1111-111111111111` |
| title | VARCHAR(300) | 标题 | `BTS 宣布 2025 年世界巡演日程` |
| summary | TEXT | 摘要 | `BTS 经纪公司 HYBE 宣布...` |
| content | TEXT | 正文内容 | `BTS 经纪公司 HYBE...` |
| original_title | TEXT | 原文标题 | `BTS, 2025년 월드투어...` |
| original_content | TEXT | 原文内容 | `null` |
| language | VARCHAR(10) | 语言 | `ko` |
| source | VARCHAR(100) | 来源 | `Naver News` |
| source_url | TEXT | 原文链接 | `https://news.naver.com/...` |
| author | VARCHAR(100) | 作者 | `정지호` |
| artist_id | UUID | 关联艺人 ID | `a1111111-...` |
| news_type | VARCHAR(30) | 类型 | `tour` |
| tags | TEXT[] | 标签数组 | `["BTS","防弹少年团"]` |
| image_url | TEXT | 主图 URL | `https://...` |
| images | TEXT[] | 图片数组 | `[]` |
| is_translated | BOOLEAN | 是否已翻译 | `true` |
| is_ai_summary | BOOLEAN | 是否 AI 生成摘要 | `false` |
| status | VARCHAR(20) | 状态 | `published` |
| priority | INT | 优先级 | `8` |
| hot_score | INT | 热度分数 | `9500` |
| view_count | INT | 浏览量 | `125000` |
| slug | VARCHAR(100) | URL 友好标识 | `bts-2025-world-tour-announcement` |
| publish_date | TIMESTAMPTZ | 发布时间 | `2025-02-28T14:30:00+09:00` |

---

## 2. 如何在 Supabase Dashboard 手动添加数据

### 方法一：Table Editor（推荐）

1. 登录 Supabase Dashboard：https://supabase.com/dashboard
2. 选择你的项目
3. 左侧菜单选择 **Table Editor**
4. 选择要插入数据的表（如 `artists`）
5. 点击 **Insert** 按钮
6. 切换到 **JSON** 视图
7. 粘贴 `scripts/seed-mock-data.ts` 输出 JSON 中的 `artists` 数组
8. 点击 **Insert** 完成

### 方法二：SQL Editor 执行 INSERT

```sql
-- 插入艺人数据（示例）
INSERT INTO artists (id, name_ko, name_zh, name_en, group_name, agency, country, debut_date, profile_image, artist_type, member_count, tags, status, hot_score, slug)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '방탄소년단', '防弹少年团', 'BTS', 'BTS', 'HYBE', 'KR', '2013-06-13', 'https://...', 'group', 7, ARRAY['kpop','hip-hop'], 'active', 9850, 'bts'),
  -- 更多艺人...
;
```

---

## 3. 使用脚本批量导入

### 步骤 1：运行脚本生成 JSON

```bash
cd ~/Documents/金会杰/创业调研/kpop-platform
npx ts-node scripts/seed-mock-data.ts
```

### 步骤 2：复制输出

脚本会在终端输出三个 JSON 数组：
- `--- ARTISTS ---` 下的内容
- `--- EVENTS ---` 下的内容
- `--- NEWS ---` 下的内容

### 步骤 3：粘贴到 Supabase Table Editor

1. Table Editor → artists → Insert → JSON → 粘贴 artists JSON
2. Table Editor → events → Insert → JSON → 粘贴 events JSON
3. Table Editor → news → Insert → JSON → 粘贴 news JSON

---

## 4. 数据关联说明

- `events.artist_id` → `artists.id`（活动所属艺人）
- `news.artist_id` → `artists.id`（新闻关联艺人）

插入顺序：
1. 先插入 `artists`（因为 events 和 news 依赖）
2. 再插入 `events`
3. 最后插入 `news`

---

## 5. 验证数据

在 Supabase SQL Editor 执行：

```sql
-- 检查数据数量
SELECT count(*) FROM artists;
SELECT count(*) FROM events;
SELECT count(*) FROM news;

-- 检查数据关联
SELECT e.title, a.name_zh as artist_name
FROM events e
LEFT JOIN artists a ON e.artist_id = a.id
LIMIT 5;
```

---

## 6. 注意事项

1. **UUID 冲突**：如果表中已有数据，新的 UUID 会报唯一性冲突。先清空表：
   ```sql
   DELETE FROM news;
   DELETE FROM events;
   DELETE FROM artists;
   ```

2. **外键约束**：`events.artist_id` 和 `news.artist_id` 引用 `artists.id`，确保 artists 先插入

3. **时区**：TIMESTAMPTZ 字段使用 ISO 8601 格式，带时区信息（如 `+09:00` 表示韩国时间）

4. **数组字段**：PostgreSQL 的 TEXT[] 类型在 JSON 中表示为数组格式 `["a","b"]`

---

_文档版本：v1.0_
_生成时间：2026-05-13_
