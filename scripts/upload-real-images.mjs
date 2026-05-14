import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const BASE_DIR = '/Users/tbndemac/Documents/金会杰/网站/kpop-images';

const artists = [
  'bts', 'blackpink', 'twice', 'iu', 'stray-kids',
  'aespa', 'sehun', 'nct-dream', 'ive', 'kazuha'
];

const events = [
  'bts-concert', 'blackpink-concert', 'twice-fanmeeting', 'iu-concert', 'stray-kids-concert'
];

async function uploadAndUpdate(type, name) {
  const filePath = `${BASE_DIR}/${type}/${name}.jpg`;
  
  if (!existsSync(filePath)) {
    console.log(`❌ ${name}: 文件不存在`);
    return false;
  }
  
  const buffer = readFileSync(filePath);
  const storagePath = `${type}/${name}.jpg`;
  
  console.log(`📤 上传 ${name} (${(buffer.length / 1024).toFixed(0)} KB)...`);
  
  // 上传到 Supabase Storage
  const { data, error } = await supabase.storage
    .from('kpop-images')
    .upload(storagePath, buffer, {
      contentType: 'image/jpeg',
      upsert: true
    });
  
  if (error) {
    console.log(`  ❌ 上传失败: ${error.message}`);
    return false;
  }
  
  console.log(`  ✅ 上传成功`);
  return true;
}

async function main() {
  console.log('🚀 上传图片到 Supabase Storage\n');
  
  // 上传艺人图片
  console.log('=== Artists ===');
  for (const name of artists) {
    await uploadAndUpdate('artists', name);
  }
  
  // 上传活动图片
  console.log('\n=== Events ===');
  for (const name of events) {
    await uploadAndUpdate('events', name);
  }
  
  console.log('\n✨ 上传完成!');
  
  // 验证
  console.log('\n验证 Storage:');
  for (const name of artists) {
    const url = `https://olyehtdnvicgcxsdvcfv.supabase.co/storage/v1/object/public/kpop-images/artists/${name}.jpg`;
    console.log(`  ${name}: ${url.substring(0, 70)}...`);
  }
}

main().catch(console.error);