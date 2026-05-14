import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 使用 Supabase Storage 或可靠图片源
const reliableImages = {
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

async function main() {
  console.log('🚀 使用 Supabase Storage 修复艺人头像...\n');
  
  const { data: artists } = await supabase
    .from('artists')
    .select('id, name_en, name_zh')
    .order('hot_score', { ascending: false });
  
  console.log(`找到 ${artists?.length || 0} 个艺人\n`);
  
  let updated = 0;
  let failed = 0;
  
  for (const artist of artists || []) {
    const imgUrl = reliableImages[artist.name_en];
    
    if (imgUrl) {
      const { error } = await supabase
        .from('artists')
        .update({ profile_image: imgUrl })
        .eq('id', artist.id);
      
      if (error) {
        console.log(`❌ ${artist.name_zh}: 更新失败`);
        failed++;
      } else {
        console.log(`✅ ${artist.name_zh}: 使用 Supabase Storage 图片`);
        updated++;
      }
    } else {
      console.log(`⚠️ ${artist.name_zh}: 无可用图片`);
      failed++;
    }
  }
  
  console.log(`\n========== 结果 ==========`);
  console.log(`✅ 更新: ${updated}`);
  console.log(`❌ 失败: ${failed}`);
  
  // 验证 - 检查图片URL是否包含有效后缀
  console.log('\n验证:');
  const { data: verify } = await supabase
    .from('artists')
    .select('name_zh, profile_image')
    .order('hot_score', { ascending: false })
    .limit(10);
  
  verify?.forEach(a => {
    const hasValidImg = a.profile_image?.includes('supabase.co/storage') || 
                        a.profile_image?.includes('unsplash.com');
    console.log(`  ${a.name_zh}: ${hasValidImg ? '✅' : '❌'} ${a.profile_image?.substring(0, 70)}`);
  });
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);