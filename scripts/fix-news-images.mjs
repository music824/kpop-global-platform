import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 艺人关键词 → 图片URL映射
const artistImages = {
  'BTS': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/bts.jpg',
  'BLACKPINK': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/blackpink.jpg',
  'TWICE': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/twice.jpg',
  'IU': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/iu.jpg',
  'Stray Kids': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/stray-kids.jpg',
  'aespa': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/aespa.jpg',
  'SEHUN': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/sehun.jpg',
  'NCT Dream': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/nct-dream.jpg',
  'IVE': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/ive.jpg',
  'KAZUHA': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/kazuha.jpg',
};

// 从 Soompi 页面提取 og:image
async function fetchOgImage(soompiUrl) {
  return new Promise((resolve) => {
    try {
      const req = http.get(soompiUrl, { timeout: 10000 }, (res) => {
        // 处理重定向
        if (res.statusCode === 301 || res.statusCode === 302) {
          const location = res.headers.location;
          if (location) {
            resolve(fetchOgImage(location.startsWith('http') ? location : 'https://www.soompi.com' + location));
            return;
          }
        }
        
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }
        
        let html = '';
        res.on('data', (chunk) => { html += chunk; });
        res.on('end', () => {
          // 提取 og:image
          const match = html.match(/<meta property="og:image" content="([^"]+)"/);
          if (match && match[1]) {
            resolve(match[1]);
          } else {
            // 尝试 twitter:image
            const twitterMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/);
            if (twitterMatch && twitterMatch[1]) {
              resolve(twitterMatch[1]);
            } else {
              resolve(null);
            }
          }
        });
      });
      
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
    } catch { resolve(null); }
  });
}

// 根据标题关键词匹配艺人图片
function matchArtistImage(title) {
  const titleLower = title.toLowerCase();
  
  for (const [artist, imgUrl] of Object.entries(artistImages)) {
    if (titleLower.includes(artist.toLowerCase())) {
      return imgUrl;
    }
    // 中文关键词
    const cnMap = {
      '防弹': 'BTS',
      'BLACKPINK': 'BLACKPINK',
      'TWICE': 'TWICE',
      'IU': 'IU',
      'Stray Kids': 'Stray Kids',
      'aespa': 'aespa',
      'SEHUN': 'SEHUN',
      'NCT Dream': 'NCT Dream',
      'IVE': 'IVE',
      'KAZUHA': 'KAZUHA',
    };
    for (const [cn, en] of Object.entries(cnMap)) {
      if (titleLower.includes(cn.toLowerCase())) {
        return artistImages[en];
      }
    }
  }
  return null;
}

async function main() {
  console.log('🚀 开始修复新闻图片...\n');
  
  // 获取所有新闻
  const { data: news } = await supabase
    .from('news')
    .select('id, title, image_url, source_url')
    .order('id', { ascending: false });
  
  console.log(`共有 ${news?.length || 0} 条新闻\n`);
  
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const item of news || []) {
    // 如果已有好图片（Supabase Storage 的真实图片），跳过
    if (item.image_url?.includes('supabase.co/storage/v1/object/public/kpop-images/news/')) {
      skipped++;
      continue;
    }
    
    let newImageUrl = null;
    
    // 方案1: 从 Soompi 页面抓 og:image
    if (item.source_url?.includes('soompi.com')) {
      console.log(`抓取: ${item.title.substring(0, 30)}...`);
      const ogImage = await fetchOgImage(item.source_url);
      if (ogImage) {
        newImageUrl = ogImage;
        console.log(`  ✅ 找到 og:image: ${ogImage.substring(0, 60)}...`);
      }
    }
    
    // 方案2: 根据标题关键词匹配艺人图片
    if (!newImageUrl) {
      const matchedImg = matchArtistImage(item.title);
      if (matchedImg) {
        newImageUrl = matchedImg;
        console.log(`  ✅ 匹配艺人图片: ${matchedImg.substring(0, 60)}...`);
      }
    }
    
    // 方案3: 保持原样（有 fallback 图片的保持 fallback）
    if (!newImageUrl) {
      console.log(`  ⚠️ 无匹配，保持原图`);
      failed++;
      continue;
    }
    
    // 更新数据库
    if (newImageUrl) {
      const { error } = await supabase
        .from('news')
        .update({ image_url: newImageUrl })
        .eq('id', item.id);
      
      if (error) {
        console.log(`  ❌ 更新失败: ${error.message}`);
      } else {
        console.log(`  ✅ 更新成功`);
        updated++;
      }
    }
  }
  
  console.log(`\n========== 结果 ==========`);
  console.log(`✅ 更新: ${updated}`);
  console.log(`⏭️ 跳过: ${skipped}`);
  console.log(`⚠️ 未找到: ${failed}`);
  
  // 验证
  console.log('\n验证前10条:');
  const { data: verify } = await supabase
    .from('news')
    .select('title, image_url')
    .order('id', { ascending: false })
    .limit(10);
  
  verify?.forEach(n => {
    const hasRealImg = n.image_url?.includes('supabase.co/storage') || 
                       n.image_url?.includes('wikimedia') ||
                       n.image_url?.includes('cdn');
    console.log(`  ${hasRealImg ? '✅' : '⚠️'} ${n.title.substring(0, 30)}: ${n.image_url?.substring(0, 70)}`);
  });
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);