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
      const req = protocol.get(url, { timeout: 8000 }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    } catch { resolve(false); }
  });
}

// 艺人 → Wikimedia 图片搜索
const artistImageMap = {
  'BTS': [
    'https://commons.wikimedia.org/wiki/File:BTS_at_the_2022_GRAMMYs,_cropped.jpg',
    'https://commons.wikimedia.org/wiki/File:BTS_Official_Logo_2021.png',
    'https://upload.wikimedia.org/wikipedia/commons/2/23/BTS_for_Office_Charming_target.jpg',
  ],
  'BLACKPINK': [
    'https://commons.wikimedia.org/wiki/File:BLACKPINK,_2021_Years_(cropped).jpg',
    'https://commons.wikimedia.org/wiki/File:Blackpink_-_Ddu-Du_Ddu-Du.png',
    'https://upload.wikimedia.org/wikipedia/commons/4/48/Blackpink_Poster.jpg',
  ],
  'TWICE': [
    'https://commons.wikimedia.org/wiki/File:TWICE,_2021_Taste_of_Love_%E2%80%93_Press_Photo(cropped).jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9c/TWICE_at_KBS_Gayo_Daesang_2018.jpg',
  ],
  'IU': [
    'https://commons.wikimedia.org/wiki/File:Lee_Ji-eun_2022_(cropped).jpg',
    'https://upload.wikimedia.org/wikipedia/commons/c/c4/IU_at_KBS_Hall,_December_9,_2017.jpg',
  ],
  'Stray Kids': [
    'https://commons.wikimedia.org/wiki/File:Stray_Kids_at_KBS_Gayo_Daesang_2022.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9c/Stray_Kids_logo.svg',
  ],
  'aespa': [
    'https://commons.wikimedia.org/wiki/File:Aespa_%22Savage%22_%E2%80%93_Press_photo.png',
    'https://upload.wikimedia.org/wikipedia/commons/5/5e/Aespa_official_logo.png',
  ],
  'SEHUN': [
    'https://commons.wikimedia.org/wiki/File:Sehun_EXO_190911.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e7/Sehun_at_X1X_Fancon.jpg',
  ],
  'NCT Dream': [
    'https://commons.wikimedia.org/wiki/File:NCT_Dream_2022_(cropped).jpg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d8/NCT_Dream_Official_Logo.png',
  ],
  'IVE': [
    'https://commons.wikimedia.org/wiki/File:IVE_%E2%80%93_Love_Dive_%E2%80%93_Press_Photo.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/Ive_official.png',
  ],
  'KAZUHA': [
    'https://commons.wikimedia.org/wiki/File:Kazuha_(LE_SSERAFIM)_at_KBS_Building_2023.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9d/Le_Sserafim_%28cropped%29.jpg',
  ],
};

// 备用图片（当找不到时用）
const fallbackImages = {
  'group': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/K-pop_group_at_SMC_2023.jpg',
  'solo': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/K-pop_singer_performing.jpg',
};

// 从 Wikimedia 页面提取实际图片 URL
async function getWikimediaImage(wikiUrl) {
  try {
    const resp = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'KPOP-Global-Platform/1.0' }
    });
    const html = await resp.text();
    
    // 提取 og:image 或者实际图片
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    if (ogMatch) return ogMatch[1];
    
    // 尝试提取文件 URL
    const fileMatch = html.match(/"(https:\/\/upload\.wikimedia\.org\/[^"]+\.(jpg|jpeg|png))"/);
    if (fileMatch) return fileMatch[1];
    
    return null;
  } catch { return null; }
}

// 用 Tavily 搜索图片（搜索图片页面而非直接图片）
async function searchImage(query) {
  try {
    const resp = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query + ' site:wikimedia.org OR site:pbs.twimg.com',
        api_key: TAVILY_KEY,
        search_depth: 'basic',
        max_results: 5
      })
    });
    const data = await resp.json();
    const results = data.results || [];
    
    // 筛选直接图片 URL
    const imgPatterns = [
      /https?:\/\/upload\.wikimedia\.org\/[^\s]+\.(jpg|jpeg|png|webp)/i,
      /https?:\/\/pbs\.twimg\.com\/media\/[^\s]+\.(jpg|jpeg|png)/i,
      /https?:\/\/wikimedia\.org\/[^\s]+\.(jpg|jpeg|png|webp)/i,
    ];
    
    for (const r of results) {
      for (const pattern of imgPatterns) {
        const match = r.url.match(pattern);
        if (match) return match[0];
      }
    }
    
    // 如果没有直接图片，尝试从 Wikimedia 页面提取
    for (const r of results) {
      if (r.url.includes('wikimedia.org')) {
        const imgUrl = await getWikimediaImage(r.url);
        if (imgUrl) return imgUrl;
      }
    }
    
    return null;
  } catch { return null; }
}

async function main() {
  console.log('🚀 开始修复艺人头像图片...\n');
  
  // 获取所有艺人
  const { data: artists, error } = await supabase
    .from('artists')
    .select('id, name_en, name_zh, artist_type')
    .order('hot_score', { ascending: false });
  
  if (error) {
    console.error('获取艺人失败:', error);
    return;
  }
  
  console.log(`找到 ${artists?.length || 0} 个艺人\n`);
  
  let successCount = 0;
  let failCount = 0;
  let useFallback = 0;
  
  for (const artist of artists || []) {
    console.log(`\n处理: ${artist.name_zh} (${artist.name_en})...`);
    
    let imageUrl = null;
    
    // 方法1: 从预设的 Wikimedia 映射获取
    const presetUrls = artistImageMap[artist.name_en];
    if (presetUrls) {
      for (const url of presetUrls) {
        const img = await getWikimediaImage(url);
        if (img) {
          const ok = await checkUrl(img);
          if (ok) {
            imageUrl = img;
            console.log(`  ✅ 预设 Wikimedia: ${img.substring(0, 70)}...`);
            break;
          }
        }
      }
    }
    
    // 方法2: 用 Tavily 搜索
    if (!imageUrl) {
      const searchTerms = [
        `${artist.name_en} K-pop group official photo`,
        `${artist.name_en} ${artist.name_zh} concert`,
      ];
      
      for (const term of searchTerms) {
        if (imageUrl) break;
        console.log(`  搜索: ${term}`);
        imageUrl = await searchImage(term);
        if (imageUrl) {
          const ok = await checkUrl(imageUrl);
          if (ok) {
            console.log(`  ✅ Tavily 找到: ${imageUrl.substring(0, 70)}...`);
          } else {
            console.log(`  ❌ 图片失效`);
            imageUrl = null;
          }
        }
      }
    }
    
    // 方法3: 用备用图片
    if (!imageUrl) {
      imageUrl = fallbackImages[artist.artist_type] || fallbackImages['group'];
      useFallback++;
      console.log(`  ⚠️ 使用备用图片`);
    }
    
    // 更新数据库
    if (imageUrl) {
      const { error: updateError } = await supabase
        .from('artists')
        .update({ profile_image: imageUrl })
        .eq('id', artist.id);
      
      if (updateError) {
        console.log(`  ❌ 更新失败: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`  ✅ 更新成功`);
        successCount++;
      }
    } else {
      failCount++;
    }
  }
  
  console.log('\n\n========== 结果 ==========');
  console.log(`✅ 成功: ${successCount}`);
  console.log(`⚠️ 备用: ${useFallback}`);
  console.log(`❌ 失败: ${failCount}`);
  
  // 验证
  console.log('\n验证结果:');
  const { data: verify } = await supabase
    .from('artists')
    .select('name_zh, profile_image')
    .order('hot_score', { ascending: false })
    .limit(5);
  
  verify?.forEach(a => {
    console.log(`  ${a.name_zh}: ${a.profile_image?.substring(0, 80)}`);
  });
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);