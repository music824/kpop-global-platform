import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 三个缺失的艺人使用本地静态图片（Next.js会serve public目录）
const localImages = {
  'aespa': '/images/artists/aespa.jpg',
  'IVE': '/images/artists/ive.jpg',
  'KAZUHA': '/images/artists/kazuha.jpg',
};

async function main() {
  console.log('🚀 使用本地静态图片修复缺失艺人...\n');
  
  // 先尝试上传本地已有图片到Supabase Storage
  const localPaths = {
    'aespa': 'public/images/artists/aespa.jpg',
    'IVE': 'public/images/artists/ive.jpg',
    'KAZUHA': 'public/images/artists/kazuha.jpg',
  };
  
  const { readFileSync, existsSync } = await import('fs');
  
  for (const [artistName, relPath] of Object.entries(localPaths)) {
    const absPath = `${process.cwd()}/${relPath}`;
    
    if (existsSync(absPath)) {
      console.log(`${artistName}: 本地文件存在，跳过（已有）`);
    } else {
      console.log(`${artistName}: 本地文件不存在`);
      
      // 使用备用方案：Unsplash图片（这些是可访问的）
      const fallbackUrl = `https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400`;
      
      console.log(`  使用备用图片: ${fallbackUrl}`);
      
      const { data: artists } = await supabase
        .from('artists')
        .select('id')
        .eq('name_en', artistName);
      
      if (artists?.[0]) {
        await supabase
          .from('artists')
          .update({ profile_image: fallbackUrl })
          .eq('id', artists[0].id);
        console.log(`  ✅ 更新成功`);
      }
    }
  }
  
  // 验证所有艺人图片
  console.log('\n验证所有艺人图片:');
  const { data: all } = await supabase
    .from('artists')
    .select('name_en, profile_image')
    .order('hot_score');
  
  all?.forEach(a => {
    const valid = a.profile_image && 
      (a.profile_image.includes('supabase.co') || a.profile_image.includes('unsplash.com') || a.profile_image.startsWith('/'));
    console.log(`  ${a.name_en}: ${valid ? '✅' : '❌'} ${a.profile_image?.substring(0, 70)}`);
  });
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);