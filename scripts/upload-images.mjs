import { createClient } from '@supabase/supabase-js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  'https://olyehtdnvicgcxsdvcfv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seWVodGRudmljZ2N4c2R2Y2Z2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYwNTQyMCwiZXhwIjoyMDk0MTgxNDIwfQ.fMv-iGCFI3ypYq2MP9Xsh5RA_jtI83FLcb1wxppAtuc'
);

async function createBucket() {
  console.log('创建 Storage bucket...');
  const { data, error } = await supabase.storage.createBucket('kpop-images', {
    public: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  });
  console.log('Bucket result:', data, 'Error:', error?.message);
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(filename, buffer);
        resolve(filename);
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function uploadToStorage(localPath, storagePath) {
  const file = fs.readFileSync(localPath);
  const { data, error } = await supabase.storage.from('kpop-images').upload(storagePath, file, {
    contentType: 'image/jpeg',
    upsert: true
  });
  if (error) {
    console.log('Upload error:', error.message);
    return null;
  }
  // 获取公开 URL
  const { data: urlData } = supabase.storage.from('kpop-images').getPublicUrl(storagePath);
  return urlData.publicUrl;
}

async function main() {
  await createBucket();
  
  // 定义 K-pop 艺人搜索词（用于找真实图片）
  const artistImages = {
    'BTS': 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400',
    'BLACKPINK': 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400',
    'TWICE': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
    'IU': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    'Stray Kids': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
    'aespa': 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400',
    'SEHUN': 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
    'NCT Dream': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
    'IVE': 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400',
    'KAZUHA': 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400',
  };
  
  console.log('\n准备上传艺人图片...');
  
  // 确保目录存在
  fs.mkdirSync('public/images/artists', { recursive: true });
  fs.mkdirSync('public/images/events', { recursive: true });
  fs.mkdirSync('public/images/news', { recursive: true });
  
  // 上传艺人图片到 Supabase Storage
  const uploadedUrls = {};
  let i = 0;
  for (const [name, imgUrl] of Object.entries(artistImages)) {
    const filename = `public/images/artists/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    console.log(`下载 ${name}...`);
    const downloaded = await downloadImage(imgUrl, filename);
    if (downloaded) {
      const storagePath = `artists/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      const publicUrl = await uploadToStorage(downloaded, storagePath);
      if (publicUrl) {
        uploadedUrls[name] = publicUrl;
        console.log(`  ✅ 上传成功: ${publicUrl}`);
      } else {
        console.log(`  ❌ 上传失败`);
      }
    } else {
      console.log(`  ❌ 下载失败`);
    }
    i++;
  }
  
  console.log('\n最终上传结果:');
  console.log(JSON.stringify(uploadedUrls, null, 2));
}

main().catch(console.error);
