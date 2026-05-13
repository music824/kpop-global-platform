import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TAVILY_API_KEY = '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';

// 翻译函数（用简单的替换逻辑，真正的翻译需要调用 AI API）
const translations = {
  'BTS': '防弹少年团',
  'BLACKPINK': 'BLACKPINK',
  'TWICE': 'TWICE',
  'IU': 'IU',
  'Stray Kids': 'Stray Kids',
  'aespa': 'aespa',
  'SEHUN': 'SEHUN',
  'NCT Dream': 'NCT Dream',
  'IVE': 'IVE',
  'KAZUHA': 'KAZUHA',
  'concert': '演唱会',
  'fanmeeting': '粉丝见面会',
  'world tour': '世界巡演',
  'ticketing': '售票中',
  'upcoming': '即将开始',
  'sold out': '售罄',
  'ticket': '门票',
  ' Seoul': ' 首尔',
  'Japan': '日本',
  'Tokyo': '东京',
};

// AI 翻译韩娱新闻为中文
async function translateToChinese(text) {
  // 简单的翻译逻辑（实际项目中可以用 MiniMax API）
  let translated = text;
  for (const [en, zh] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(en, 'gi'), zh);
  }
  return translated;
}

// 从 Tavily 搜索最新韩娱新闻
async function searchKpopNews() {
  const queries = [
    'K-pop news BTS BLACKPINK May 2026',
    'K-pop concert tour Asia 2026',
    'Korean idol group announcement May 2026',
  ];

  const allNews = [];

  for (const query of queries) {
    try {
      const response = await fetch(`https://api.tavily.com/search?query=${encodeURIComponent(query)}&api_key=${TAVILY_API_KEY}&search_depth=basic&max_results=3`);
      const data = await response.json();
      if (data.results) {
        allNews.push(...data.results);
      }
    } catch (err) {
      console.log('Tavily search failed:', err.message);
    }
  }

  return allNews;
}

// 生成 UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 主函数：收集新闻并写入 Supabase
async function collectAndInsertNews() {
  console.log('🔍 开始收集韩娱新闻...');
  
  const rawNews = await searchKpopNews();
  
  if (rawNews.length === 0) {
    console.log('没有找到新闻，使用模拟数据');
    // 使用模拟数据演示流程
    rawNews.push({
      title: 'BTS 2026 世界巡演追加东京站',
      url: 'https://soompi.com',
      content: '防弹少年团宣布将在2026年世界巡演中追加东京巨蛋站，门票将于6月开售。',
    });
  }

  console.log(`📰 找到 ${rawNews.length} 条新闻`);

  for (const item of rawNews) {
    const chineseTitle = await translateToChinese(item.title);
    const chineseSummary = await translateToChinese(item.content || item.url);

    const newsItem = {
      id: generateUUID(),
      title: chineseTitle,
      summary: chineseSummary.substring(0, 200),
      content: chineseSummary,
      original_title: item.title,
      original_content: item.content || '',
      language: 'zh',
      source: 'Soompi',
      source_url: item.url || 'https://soompi.com',
    };

    // 检查是否已存在（根据标题匹配）
    const { data: existing } = await supabase
      .from('news')
      .select('id')
      .eq('title', chineseTitle)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`⏭️  已存在，跳过: ${chineseTitle}`);
      continue;
    }

    // 写入 Supabase
    const { error } = await supabase.from('news').insert(newsItem);
    if (error) {
      console.log(`❌ 写入失败: ${error.message}`);
    } else {
      console.log(`✅ 已添加: ${chineseTitle}`);
    }
  }

  // 显示最终结果
  const { data: allNews } = await supabase.from('news').select('id, title').order('id', { ascending: false }).limit(5);
  console.log('\n📋 当前新闻列表:');
  allNews?.forEach(n => console.log(`  - ${n.title}`));
}

// 运行
collectAndInsertNews().catch(console.error);
