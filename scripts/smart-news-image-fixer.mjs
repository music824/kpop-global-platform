import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 新闻类型 → 图片规则
const typeRules = [
  {
    // 演唱会/世界巡演/巡演 → 用活动海报
    patterns: ['world tour', 'tour', 'concert', '巡演', '演唱会', '亚洲巡演', '世界巡演'],
    getImage: (title) => {
      const artistMap = {
        'BTS': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/bts-concert.jpg',
        'BLACKPINK': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/blackpink-concert.jpg',
        'TWICE': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/twice-fanmeeting.jpg',
        'IU': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/iu-concert.jpg',
        'Stray Kids': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/stray-kids-concert.jpg',
        '防弹': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/bts-concert.jpg',
      };
      for (const [key, img] of Object.entries(artistMap)) {
        if (title.toLowerCase().includes(key.toLowerCase())) return img;
      }
      return null; // 没匹配到具体艺人，用通用
    },
    priority: 1
  },
  {
    // MV/舞蹈练习/Watch视频 → 用艺人照片
    patterns: ['watch:', 'mv', 'music video', 'dance practice', 'performance video', 'stage', '舞台'],
    getImage: (title) => {
      const artistMap = {
        'BTS': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/bts.jpg',
        'BLACKPINK': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/blackpink.jpg',
        'TWICE': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/twice.jpg',
        'IU': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/iu.jpg',
        'Stray Kids': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/stray-kids.jpg',
        'aespa': 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400', // fallback
        'SEHUN': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/sehun.jpg',
        'NCT Dream': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/nct-dream.jpg',
      };
      for (const [key, img] of Object.entries(artistMap)) {
        if (title.toLowerCase().includes(key.toLowerCase())) return img;
      }
      return null; // 没艺人关键词用通用
    },
    priority: 2
  },
  {
    // 专辑/回归/新歌/发行 → 用艺人照片
    patterns: ['comeback', 'album', 'release', 'single', '专辑', '回归', '新歌', '发行'],
    getImage: (title) => {
      const artistMap = {
        'BTS': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/bts.jpg',
        'BLACKPINK': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/blackpink.jpg',
        'TWICE': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/twice.jpg',
        'IU': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/iu.jpg',
        'IVE': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
        'aespa': 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400',
        'Stray Kids': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/stray-kids.jpg',
      };
      for (const [key, img] of Object.entries(artistMap)) {
        if (title.toLowerCase().includes(key.toLowerCase())) return img;
      }
      return null;
    },
    priority: 3
  }
];

// 通用 fallback 图片池（音乐/K-pop相关）
const fallbacks = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', // 音乐会
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', // 舞台灯光
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', // 演唱会人群
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', // 音乐节
];

// 如果一个新闻有多个艺人，主要用排第一的
const primaryArtistOrder = ['BTS', 'BLACKPINK', 'TWICE', 'IU', 'aespa', 'Stray Kids', 'NCT Dream', 'SEHUN', 'IVE', 'KAZUHA'];

function extractPrimaryArtist(title) {
  const titleLower = title.toLowerCase();
  for (const artist of primaryArtistOrder) {
    if (titleLower.includes(artist.toLowerCase())) return artist;
  }
  return null;
}

function getImageForType(newsType, title) {
  const typeRule = typeRules.find(r => r.patterns.some(p => newsType.includes(p)));
  if (typeRule) {
    return typeRule.getImage(title);
  }
  return null;
}

function classifyNews(title) {
  const titleLower = title.toLowerCase();
  
  // 检查类型
  for (const rule of typeRules) {
    for (const pattern of rule.patterns) {
      if (titleLower.includes(pattern.toLowerCase())) {
        return { matched: true, type: pattern, rule };
      }
    }
  }
  
  return { matched: false, type: null, rule: null };
}

async function main() {
  console.log('🚀 智能修复新闻图片（按内容类型匹配）...\n');
  
  // 获取所有新闻
  const { data: news } = await supabase
    .from('news')
    .select('id, title, image_url, source_url')
    .order('id', { ascending: false });
  
  console.log(`共有 ${news?.length || 0} 条新闻\n`);
  
  let updated = 0;
  let skipped = 0;
  let useFallback = 0;
  
  for (const item of news || []) {
    // 如果已有 Supabase Storage 的新闻专用图片，跳过（这些是之前手动上传的）
    if (item.image_url?.includes('supabase.co/storage/v1/object/public/kpop-images/news/')) {
      skipped++;
      continue;
    }
    
    // 分类新闻类型
    const classification = classifyNews(item.title);
    
    let newImageUrl = null;
    let matchReason = '';
    
    if (classification.matched) {
      newImageUrl = classification.rule.getImage(item.title);
      matchReason = classification.type;
    }
    
    // 如果没有匹配到类型图片，尝试提取艺人
    if (!newImageUrl) {
      const artist = extractPrimaryArtist(item.title);
      if (artist) {
        const artistImgMap = {
          'BTS': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/bts.jpg',
          'BLACKPINK': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/blackpink.jpg',
          'TWICE': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/twice.jpg',
          'IU': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/iu.jpg',
          'Stray Kids': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/stray-kids.jpg',
          'aespa': 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400',
          'SEHUN': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/sehun.jpg',
          'NCT Dream': 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/nct-dream.jpg',
          'IVE': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
          'KAZUHA': 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400',
        };
        newImageUrl = artistImgMap[artist];
        matchReason = artist + ' (艺人匹配)';
      }
    }
    
    // 最终 fallback
    if (!newImageUrl) {
      // 对于完全不相关的新闻（演员/K-Drama等），用一个通用的
      newImageUrl = fallbacks[item.id.charCodeAt(0) % fallbacks.length];
      matchReason = '通用 fallback';
      useFallback++;
    } else {
      useFallback++;
    }
    
    // 更新数据库
    if (newImageUrl) {
      const { error } = await supabase
        .from('news')
        .update({ image_url: newImageUrl })
        .eq('id', item.id);
      
      if (error) {
        console.log(`❌ ${item.title.substring(0, 40)}: 更新失败`);
      } else {
        console.log(`✅ ${item.title.substring(0, 35)} [${matchReason}]`);
        updated++;
      }
    }
  }
  
  console.log(`\n========== 结果 ==========`);
  console.log(`✅ 更新: ${updated}`);
  console.log(`⏭️ 跳过(已有新闻图): ${skipped}`);
  console.log(`⚠️ 使用 fallback: ${useFallback}`);
  
  // 验证
  console.log('\n验证样本:');
  const { data: verify } = await supabase
    .from('news')
    .select('title, image_url')
    .order('id', { ascending: false })
    .limit(10);
  
  verify?.forEach(n => {
    console.log(`  ${n.title.substring(0, 35)}: ${n.image_url?.substring(0, 60)}`);
  });
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);