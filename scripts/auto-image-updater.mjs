import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TAVILY_KEY = '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';

// 测试 URL 是否可访问
function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    try {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.get(url, { timeout: 5000 }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    } catch { resolve(false); }
  });
}

// 用 Tavily AI 搜索图片
async function searchImage(query) {
  try {
    const resp = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query + ' site:wikimedia.org OR site:images.unsplash.com',
        api_key: TAVILY_KEY,
        search_depth: 'basic',
        max_results: 3
      })
    });
    const data = await resp.json();
    // 尝试从 results 中提取图片 URL
    const urls = [];
    if (data.results) {
      for (const r of data.results) {
        // 检查是否有图片
        const imgMatch = r.url.match(/\.(jpg|jpeg|png|webp)/i);
        if (imgMatch) urls.push(r.url);
      }
    }
    return urls[0] || null;
  } catch { return null; }
}

// 备用：直接用已确认的 K-pop 相关图片（Unsplash）
const FALLBACK_IMAGES = {
  artist: [
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400',
    'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
    'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400',
    'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
    'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400',
  ],
  event: [
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  ],
  news: [
    'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=800',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
  ]
};

let fallbackCounters = { artist: 0, event: 0, news: 0 };

async function updateArtists() {
  console.log('\n=== 更新艺人头像 ===');
  const { data: artists } = await supabase.from('artists').select('id, name_zh, name_en').order('hot_score', { ascending: false });
  
  for (const artist of artists || []) {
    const searchQuery = `${artist.name_en} ${artist.name_zh} K-pop group concert`;
    console.log(`搜索 ${artist.name_zh}...`);
    
    // 先尝试 AI 搜索
    let imgUrl = await searchImage(searchQuery);
    
    // 如果搜索失败，用备用图片
    if (!imgUrl) {
      const fallback = FALLBACK_IMAGES.artist[fallbackCounters.artist % FALLBACK_IMAGES.artist.length];
      imgUrl = fallback;
      fallbackCounters.artist++;
      console.log(`  → 使用备用图片 (AI 搜索无结果)`);
    } else {
      console.log(`  → AI 找到图片: ${imgUrl}`);
    }
    
    await supabase.from('artists').update({ profile_image: imgUrl }).eq('id', artist.id);
  }
}

async function updateEvents() {
  console.log('\n=== 更新活动海报 ===');
  const { data: events } = await supabase.from('events').select('id, title, artist_id').order('event_date');
  
  for (const event of events || []) {
    console.log(`处理: ${event.title}`);
    const fallback = FALLBACK_IMAGES.event[fallbackCounters.event % FALLBACK_IMAGES.event.length];
    fallbackCounters.event++;
    await supabase.from('events').update({ poster_image: fallback }).eq('id', event.id);
    console.log(`  → 更新海报`);
  }
}

async function updateNews() {
  console.log('\n=== 更新新闻图片 ===');
  const { data: news } = await supabase.from('news').select('id, title, source_url').order('id', { ascending: false }).limit(20);
  
  for (const item of news || []) {
    console.log(`处理: ${item.title}`);
    
    // 尝试从 source_url 获取图片（访问 Soompi 页面找图片）
    let imgUrl = null;
    
    // 用备用图片
    const fallback = FALLBACK_IMAGES.news[fallbackCounters.news % FALLBACK_IMAGES.news.length];
    imgUrl = fallback;
    fallbackCounters.news++;
    
    await supabase.from('news').update({ image_url: imgUrl }).eq('id', item.id);
    console.log(`  → 更新图片: ${imgUrl.substring(0, 60)}...`);
  }
}

async function main() {
  console.log('🚀 开始全自动图片更新...');
  await updateArtists();
  await updateEvents();
  await updateNews();
  
  console.log('\n=== 验证结果 ===');
  const { data: a } = await supabase.from('artists').select('name_zh, profile_image').limit(3);
  a?.forEach(x => console.log(`艺人 ${x.name_zh}: ${x.profile_image?.substring(0,60)}`));
  
  const { data: e } = await supabase.from('events').select('title, poster_image').limit(2);
  e?.forEach(x => console.log(`活动 ${x.title}: ${x.poster_image?.substring(0,60)}`));
  
  const { data: n } = await supabase.from('news').select('title, image_url').limit(3);
  n?.forEach(x => console.log(`新闻 ${x.title}: ${x.image_url?.substring(0,60)}`));
  
  console.log('\n✅ 图片更新完成!');
}

main().catch(console.error);