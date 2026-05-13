import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // 需要申请

// 艺人和对应的 Unsplash 搜索词
const artistImageMap = {
  'a1111111-1111-1111-1111-111111111111': { name: 'BTS Kpop group', fallback: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400' },
  'a2222222-2222-2222-2222-222222222222': { name: 'BLACKPINK Kpop girl group', fallback: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400' },
  'a3333333-3333-3333-3333-333333333333': { name: 'TWICE Kpop girl group', fallback: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400' },
  'a4444444-4444-4444-4444-444444444444': { name: 'IU Korean singer solo', fallback: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  'a5555555-5555-5555-5555-555555555555': { name: 'Stray Kids Kpop boy group', fallback: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400' },
  'a6666666-6666-6666-6666-666666666666': { name: 'aespa Kpop girl group', fallback: 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400' },
  'a7777777-7777-7777-7777-777777777777': { name: 'EXO Sehun Kpop', fallback: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400' },
  'a8888888-8888-8888-8888-888888888888': { name: 'NCT Dream Kpop boy group', fallback: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400' },
  'a9999999-9999-9999-9999-999999999999': { name: 'IVE Kpop girl group', fallback: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400' },
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': { name: 'LE SSERAFIM Kpop girl group', fallback: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400' },
};

// 用预设的高质量图片（确认能访问的 Kpop 相关图片）
const confirmedImages = {
  'a1111111-1111-1111-1111-111111111111': 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400',
  'a2222222-2222-2222-2222-222222222222': 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400',
  'a3333333-3333-3333-3333-333333333333': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
  'a4444444-4444-4444-4444-444444444444': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  'a5555555-5555-5555-5555-555555555555': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
  'a6666666-6666-6666-6666-666666666666': 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400',
  'a7777777-7777-7777-7777-777777777777': 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
  'a8888888-8888-8888-8888-888888888888': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
  'a9999999-9999-9999-9999-999999999999': 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400',
};

// 更新所有艺人头像
async function updatePhotos() {
  console.log('开始更新艺人照片...');
  
  for (const [artistId, imageUrl] of Object.entries(confirmedImages)) {
    const { error } = await supabase
      .from('artists')
      .update({ profile_image: imageUrl })
      .eq('id', artistId);
    
    if (error) {
      console.log(`更新失败 ${artistId}:`, error.message);
    } else {
      console.log(`✓ 已更新 ${artistId}`);
    }
  }
  
  // 验证结果
  const { data } = await supabase.from('artists').select('id, name_zh, profile_image');
  console.log('\n最终结果:');
  data?.forEach(a => console.log(`  ${a.name_zh}: ${a.profile_image}`));
}

updatePhotos().catch(console.error);
