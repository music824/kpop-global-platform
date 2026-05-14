import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 艺人图片库（每种类型）
const artistImageLibrary = {
  'BTS': {
    concert: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/bts-concert.jpg',
    group: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/bts.jpg',
    album: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/bts.jpg',
  },
  'BLACKPINK': {
    concert: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/blackpink-concert.jpg',
    group: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/blackpink.jpg',
    album: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/blackpink.jpg',
  },
  'TWICE': {
    concert: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/twice-fanmeeting.jpg',
    group: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/twice.jpg',
    album: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/twice.jpg',
  },
  'IU': {
    concert: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/iu-concert.jpg',
    group: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/iu.jpg',
    album: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/iu.jpg',
  },
  'Stray Kids': {
    concert: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/events/stray-kids-concert.jpg',
    group: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/stray-kids.jpg',
    album: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/stray-kids.jpg',
  },
  'aespa': {
    concert: 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=800',
    group: 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=800',
    album: 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=800',
  },
  'SEHUN': {
    concert: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/sehun.jpg',
    group: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/sehun.jpg',
    album: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/sehun.jpg',
  },
  'NCT Dream': {
    concert: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/nct-dream.jpg',
    group: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/nct-dream.jpg',
    album: 'https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/nct-dream.jpg',
  },
  'IVE': {
    concert: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    group: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
    album: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
  },
  'KAZUHA': {
    concert: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=800',
    group: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=800',
    album: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=800',
  },
};

const cnNameMap = {
  '防弹': 'BTS', '防弹少年团': 'BTS',
  'BLACKPINK': 'BLACKPINK', 'TWICE': 'TWICE', 'IU': 'IU',
  'Stray Kids': 'Stray Kids', 'aespa': 'aespa',
  'SEHUN': 'SEHUN', 'NCT Dream': 'NCT Dream', 'IVE': 'IVE', 'KAZUHA': 'KAZUHA',
};

const typePatterns = {
  concert: ['world tour', 'tour', 'concert', '巡演', '演唱会', '亚洲巡演', '世界巡演', '粉丝见面会', 'fanmeeting'],
  album: ['album', 'comeback', 'release', 'single', 'mini album', 'full album', '专辑', '回归', '新歌', '发行'],
  watch: ['watch:', 'mv', 'music video', 'dance practice', 'performance', '舞台'],
};

const fallbacks = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
];

function getImageType(title) {
  const lower = title.toLowerCase();
  for (const [type, patterns] of Object.entries(typePatterns)) {
    for (const p of patterns) {
      if (lower.includes(p.toLowerCase())) return type;
    }
  }
  return 'group';
}

function extractArtist(title) {
  const lower = title.toLowerCase();
  for (const [cn, en] of Object.entries(cnNameMap)) {
    if (lower.includes(cn.toLowerCase())) return en;
  }
  for (const name of Object.keys(artistImageLibrary)) {
    if (lower.includes(name.toLowerCase())) return name;
  }
  return null;
}

async function main() {
  console.log('🚀 智能匹配新闻图片\n');
  
  const { data: news, error } = await supabase
    .from('news')
    .select('id, title, image_url')
    .order('id', { ascending: false });
  
  if (error) {
    console.error('获取新闻失败:', error.message);
    return;
  }
  
  console.log(`处理 ${news?.length || 0} 条新闻\n`);
  
  let updated = 0;
  let skipped = 0;
  let fbCount = 0;
  
  for (const item of news || []) {
    const artist = extractArtist(item.title || '');
    const imgType = getImageType(item.title || '');
    let newImageUrl = null;
    
    if (artist && artistImageLibrary[artist]) {
      newImageUrl = artistImageLibrary[artist][imgType];
      console.log(`✅ ${(item.title || '').substring(0, 35)} [${artist}] ${imgType}`);
    } else {
      const fb = fallbacks[Math.abs((item.id || 'x').charCodeAt(0)) % fallbacks.length];
      newImageUrl = fb;
      fbCount++;
      console.log(`⚠️ ${(item.title || '').substring(0, 35)} [无匹配]`);
    }
    
    if (newImageUrl) {
      const { error: updateError } = await supabase
        .from('news')
        .update({ image_url: newImageUrl })
        .eq('id', item.id);
      
      if (updateError) {
        console.log(`  ❌ ${updateError.message}`);
      } else {
        updated++;
      }
    }
  }
  
  console.log(`\n✅ 更新: ${updated} | ⚠️ fallback: ${fbCount}`);
  
  // 统计
  const { data: check } = await supabase.from('news').select('image_url');
  let storage = 0, unsplash = 0, nullCount = 0;
  check?.forEach(n => {
    if (n.image_url?.includes('supabase.co/storage')) storage++;
    else if (n.image_url?.includes('unsplash')) unsplash++;
    else if (!n.image_url) nullCount++;
  });
  console.log(`\n统计: Storage=${storage} | Unsplash=${unsplash} | NULL=${nullCount}`);
  console.log('\n✨ 完成!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });