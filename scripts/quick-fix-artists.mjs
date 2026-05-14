import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Wikimedia API 搜索图片
async function searchWikimediaImage(artistName) {
  try {
    // 用 Wikimedia API 搜索
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(artistName + ' K-pop')}&format=json&srlimit=5`;
    const resp = await fetch(searchUrl, {
      headers: { 'User-Agent': 'KPOP-Global-Platform/1.0 (contact@example.com)' }
    });
    const data = await resp.json();
    
    if (!data.query?.search) return null;
    
    // 获取每个搜索结果的图片
    for (const result of data.query.search) {
      const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`;
      const detailResp = await fetch(`${pageUrl}?action=raw`, {
        headers: { 'User-Agent': 'KPOP-Global-Platform/1.0' }
      });
      const wikiText = await detailResp.text();
      
      // 查找图片
      const imgMatch = wikiText.match(/\[\[(File|Image):([^\]|]+)/i);
      if (imgMatch) {
        const fileName = imgMatch[2];
        // 获取实际图片 URL
        const imgInfoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
        const imgResp = await fetch(imgInfoUrl);
        const imgData = await imgResp.json();
        
        const pages = imgData.query?.pages;
        if (pages) {
          for (const pageId of Object.keys(pages)) {
            const imgUrl = pages[pageId]?.imageinfo?.[0]?.url;
            if (imgUrl && !imgUrl.includes('silhouette')) {
              return imgUrl;
            }
          }
        }
      }
    }
    return null;
  } catch (e) {
    console.error('Wikimedia 搜索失败:', e.message);
    return null;
  }
}

// 预设的可靠图片（直接从 Wikimedia 直接链接）
const presetImages = {
  'BTS': 'https://upload.wikimedia.org/wikipedia/commons/2/23/BTS_for_Office_Charming_target.jpg',
  'BLACKPINK': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Blackpink_Poster.jpg',
  'TWICE': 'https://upload.wikimedia.org/wikipedia/commons/9/9c/TWICE_at_KBS_Gayo_Daesun_2018.jpg',
  'IU': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/IU_at_KBS_Hall,_December_9,_2017.jpg',
  'Stray Kids': 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Stray_Kids_logo.svg',
  'aespa': 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Aespa_official_logo.png',
  'SEHUN': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Sehun_at_X1X_Fancon.jpg',
  'NCT Dream': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/NCT_Dream_Official_Logo.png',
  'IVE': 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Ive_official.png',
  'KAZUHA': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Le_Sserafim_%28cropped%29.jpg',
};

async function main() {
  console.log('🚀 快速修复艺人头像...\n');
  
  const { data: artists } = await supabase
    .from('artists')
    .select('id, name_en, name_zh')
    .order('hot_score', { ascending: false });
  
  console.log(`找到 ${artists?.length || 0} 个艺人\n`);
  
  let updated = 0;
  let failed = 0;
  
  for (const artist of artists || []) {
    const imgUrl = presetImages[artist.name_en];
    
    if (imgUrl) {
      const { error } = await supabase
        .from('artists')
        .update({ profile_image: imgUrl })
        .eq('id', artist.id);
      
      if (error) {
        console.log(`❌ ${artist.name_zh}: 更新失败 - ${error.message}`);
        failed++;
      } else {
        console.log(`✅ ${artist.name_zh}: ${imgUrl.substring(0, 60)}...`);
        updated++;
      }
    } else {
      console.log(`⚠️ ${artist.name_zh}: 无预设图片`);
      failed++;
    }
  }
  
  console.log(`\n========== 结果 ==========`);
  console.log(`✅ 更新: ${updated}`);
  console.log(`❌ 失败: ${failed}`);
  
  // 验证
  console.log('\n验证:');
  const { data: verify } = await supabase
    .from('artists')
    .select('name_zh, profile_image')
    .limit(5);
  
  verify?.forEach(a => console.log(`  ${a.name_zh}: ${a.profile_image?.substring(0, 70)}`));
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);