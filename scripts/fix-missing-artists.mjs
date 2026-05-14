import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import { writeFileSync } from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TAVILY_KEY = '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';

// 备用图片URL（可用的直接链接）
const backupImages = {
  'aespa': 'https://pbs.twimg.com/media/GlkQ_0ebYAAX5_9?format=jpg&name=large',
  'IVE': 'https://pbs.twimg.com/media/ERmYVdNUcAE2_78?format=jpg&name=large',
  'KAZUHA': 'https://pbs.twimg.com/media/FPG7T6KaUAAd9Lr?format=jpg&name=large',
};

// 下载图片
async function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // 重定向
        resolve(downloadImage(res.headers.location, destPath));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        writeFileSync(destPath, buffer);
        resolve(buffer.length);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// 上传到 Supabase Storage
async function uploadToStorage(localPath, storagePath) {
  const buffer = readFileSync(localPath);
  const { data, error } = await supabase.storage
    .from('kpop-images')
    .upload(storagePath, buffer, {
      contentType: 'image/jpeg',
      upsert: true
    });
  
  if (error) throw error;
  return data;
}

// 用 Tavily 搜索图片
async function searchWithTavily(artistName) {
  try {
    const resp = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `${artistName} K-pop official photo site:x.com OR site:pbs.twimg.com`,
        api_key: TAVILY_KEY,
        search_depth: 'basic',
        max_results: 3
      })
    });
    const data = await resp.json();
    
    // 提取推特图片
    const twimgPatterns = [
      /https?:\/\/pbs\.twimg\.com\/media\/[^\s]+\.(jpg|jpeg|png)/i,
    ];
    
    for (const r of data.results || []) {
      for (const pattern of twimgPatterns) {
        const match = r.url.match(pattern);
        if (match) return match[0];
      }
    }
    return null;
  } catch { return null; }
}

async function main() {
  console.log('🚀 修复缺失艺人图片...\n');
  
  const missingArtists = ['aespa', 'IVE', 'KAZUHA'];
  const tmpDir = '/tmp/kpop-img-fix/';
  
  // 确保临时目录存在
  const { existsSync } = await import('fs');
  if (!existsSync(tmpDir)) {
    await import('fs').then(m => m.mkdirSync(tmpDir, { recursive: true }));
  }
  
  for (const artistName of missingArtists) {
    console.log(`\n处理 ${artistName}...`);
    
    const localPath = `${tmpDir}${artistName.toLowerCase()}.jpg`;
    let imgUrl = backupImages[artistName];
    
    // 尝试下载备用图片
    if (imgUrl) {
      try {
        console.log(`  下载: ${imgUrl.substring(0, 60)}...`);
        await downloadImage(imgUrl, localPath);
        console.log(`  ✅ 下载成功`);
        
        // 上传到 Supabase
        const storagePath = `artists/${artistName.toLowerCase()}.jpg`;
        console.log(`  上传到 Storage...`);
        await uploadToStorage(localPath, storagePath);
        console.log(`  ✅ 上传成功`);
        
        // 更新数据库
        const dbUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kpop-images/${storagePath}`;
        await supabase.from('artists').update({ profile_image: dbUrl }).eq('name_en', artistName);
        console.log(`  ✅ 数据库更新成功`);
        
      } catch (e) {
        console.log(`  ❌ 失败: ${e.message}`);
        
        // 尝试 Tavily 搜索
        console.log(`  尝试 Tavily 搜索...`);
        const tavilyUrl = await searchWithTavily(artistName);
        if (tavilyUrl) {
          try {
            await downloadImage(tavilyUrl, localPath);
            await uploadToStorage(localPath, `artists/${artistName.toLowerCase()}.jpg`);
            const dbUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kpop-images/artists/${artistName.toLowerCase()}.jpg`;
            await supabase.from('artists').update({ profile_image: dbUrl }).eq('name_en', artistName);
            console.log(`  ✅ Tavily 方案成功`);
          } catch (e2) {
            console.log(`  ❌ Tavily 也失败: ${e2.message}`);
          }
        }
      }
    }
  }
  
  console.log('\n验证结果:');
  const { data } = await supabase.from('artists').select('name_en, profile_image').in('name_en', missingArtists);
  data?.forEach(a => console.log(`  ${a.name_en}: ${a.profile_image?.substring(0, 70)}`));
  
  console.log('\n✨ 完成!');
}

main().catch(console.error);