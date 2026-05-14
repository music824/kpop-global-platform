import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 需要上传的图片（本地有但Supabase没有的）
const uploadList = [
  { artist: 'aespa', file: 'public/images/artists/aespa.jpg' },
  { artist: 'IVE', file: 'public/images/artists/ive.jpg' },
  { artist: 'KAZUHA', file: 'public/images/artists/kazuha.jpg' },
];

async function uploadImage(filePath, destPath) {
  try {
    const buffer = readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from('kpop-images')
      .upload(destPath, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.log(`  ❌ 上传失败: ${error.message}`);
      return false;
    }
    console.log(`  ✅ 上传成功: ${destPath}`);
    return true;
  } catch (e) {
    console.log(`  ❌ 错误: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 上传缺失的艺人图片到 Supabase Storage...\n');
  
  let uploaded = 0;
  let failed = 0;
  
  for (const item of uploadList) {
    console.log(`处理 ${item.artist}...`);
    const fullPath = path.join(process.cwd(), item.file);
    
    // 检查本地文件是否存在
    try {
      readFileSync(fullPath);
    } catch {
      console.log(`  ⚠️ 本地文件不存在: ${fullPath}`);
      // 下载一个备用图片
      failed++;
      continue;
    }
    
    const destPath = `artists/${item.artist.toLowerCase()}.jpg`;
    const ok = await uploadImage(fullPath, destPath);
    if (ok) uploaded++;
    else failed++;
  }
  
  console.log(`\n========== 结果 ==========`);
  console.log(`✅ 上传: ${uploaded}`);
  console.log(`❌ 失败: ${failed}`);
  
  // 更新数据库URL
  if (uploaded > 0) {
    console.log('\n更新数据库图片URL...');
    
    const urlBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kpop-images`;
    
    for (const item of uploadList) {
      const imgUrl = `${urlBase}/artists/${item.artist.toLowerCase()}.jpg`;
      
      const { data: artists } = await supabase
        .from('artists')
        .select('id')
        .eq('name_en', item.artist);
      
      if (artists?.[0]) {
        await supabase
          .from('artists')
          .update({ profile_image: imgUrl })
          .eq('id', artists[0].id);
        console.log(`  ✅ ${item.artist}: ${imgUrl}`);
      }
    }
  }
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);