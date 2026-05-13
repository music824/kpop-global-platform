import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TAVILY_KEY = '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';

// 测试 URL 是否可访问
async function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    try {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.get(url, { timeout: 5000 }, (res) => resolve(res.statusCode === 200));
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    } catch { resolve(false); }
  });
}

// 用 Tavily 搜索图片 URL
async function searchImage(query) {
  try {
    const resp = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query + ' official photo high quality',
        api_key: TAVILY_KEY,
        search_depth: 'basic',
        max_results: 10
      })
    });
    const data = await resp.json();
    const results = data.results || [];
    
    // 筛选出图片 URL（wikimedia, unsplash, pbs.twimg 等）
    const imgPatterns = [
      /https?:\/\/upload\.wikimedia\.org\/[^\s]+\.(jpg|jpeg|png|webp)/i,
      /https?:\/\/images\.unsplash\.com\/[^\s]+/i,
      /https?:\/\/pbs\.twimg\.com\/media\/[^\s]+\.(jpg|jpeg|png)/i,
    ];
    
    for (const r of results) {
      for (const pattern of imgPatterns) {
        const match = r.url.match(pattern);
        if (match) {
          const url = match[0];
          // 验证 URL 可访问
          const ok = await checkUrl(url);
          if (ok) return url;
        }
      }
    }
    return null;
  } catch { return null; }
}

// 艺人列表（搜索关键词）
const artistSearchTerms = {
  'a1111111-1111-1111-1111-111111111111': ['BTS 방탄소년단 group photo', 'BTS official photo concert'],
  'a2222222-2222-2222-2222-222222222222': ['BLACKPINK blackpink group photo', 'BLACKPINK official concert'],
  'a3333333-3333-3333-3333-333333333333': ['TWICE twice group photo', 'TWICE official concert'],
  'a4444444-4444-4444-4444-444444444444': ['IU 아이유 solo photo', 'IU singer official'],
  'a5555555-5555-5555-5555-555555555555': ['Stray Kids stray kids group photo', 'Stray Kids concert'],
  'a6666666-6666-6666-6666-666666666666': ['aespa 에스파 group photo', 'aespa official concert'],
  'a7777777-7777-7777-7777-777777777777': ['EXO Sehun 세훈 photo', 'Sehun EXO official'],
  'a8888888-8888-8888-8888-888888888888': ['NCT Dream nct dream group photo', 'NCT Dream concert'],
  'a9999999-9999-9999-9999-999999999999': ['IVE ive group photo', 'IVE official concert'],
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': ['LE SSERAFIM Kazuha 카자흐 photo', 'Kazuha LE SSERAFIM official'],
};

async function main() {
  console.log('🚀 开始全自动艺人头像搜索...');
  
  const { data: artists } = await supabase.from('artists').select('id, name_zh, name_en').order('hot_score', { ascending: false });
  
  let successCount = 0;
  let failCount = 0;
  
  for (const artist of artists || []) {
    const searchTerms = artistSearchTerms[artist.id] || [`${artist.name_en} ${artist.name_zh} K-pop`];
    
    console.log(`\n搜索 ${artist.name_zh} (${artist.name_en})...`);
    
    let foundUrl = null;
    
    // 尝试多个搜索词
    for (const term of searchTerms) {
      if (foundUrl) break;
      console.log(`  尝试: ${term}`);
      foundUrl = await searchImage(term);
      if (foundUrl) {
        console.log(`  ✅ 找到: ${foundUrl.substring(0, 70)}...`);
      }
    }
    
    if (foundUrl) {
      await supabase.from('artists').update({ profile_image: foundUrl }).eq('id', artist.id);
      successCount++;
    } else {
      console.log(`  ❌ 未找到，保持原图`);
      failCount++;
    }
  }
  
  console.log(`\n\n📊 结果: 成功 ${successCount} 个, 失败 ${failCount} 个`);
  
  // 验证
  console.log('\n验证结果:');
  const { data: check } = await supabase.from('artists').select('name_zh, profile_image').limit(10);
  check?.forEach(a => console.log(`  ${a.name_zh}: ${a.profile_image?.substring(0, 70)}`));
}

main().catch(console.error);