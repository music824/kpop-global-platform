import { createClient } from '@supabase/supabase-js';
import https from 'https';
import fs from 'fs';

const supabase = createClient(
  'https://olyehtdnvicgcxsdvcfv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seWVodGRudmljZ2N4c2R2Y2Z2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYwNTQyMCwiZXhwIjoyMDk0MTgxNDIwfQ.fMv-iGCFI3ypYq2MP9Xsh5RA_jtI83FLcb1wxppAtuc'
);

function downloadImage(url, filename) {
  return new Promise((resolve) => {
    if (!url) { resolve(null); return; }
    const req = https.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) { resolve(null); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(filename, Buffer.concat(chunks));
        resolve(filename);
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function uploadToStorage(localPath, storagePath) {
  const file = fs.readFileSync(localPath);
  const { error } = await supabase.storage.from('kpop-images').upload(storagePath, file, {
    contentType: 'image/jpeg',
    upsert: true
  });
  if (error) return null;
  return supabase.storage.from('kpop-images').getPublicUrl(storagePath).data.publicUrl;
}

// 完整的图片映射（艺人对应用哪个 Unsplash 图片）
const artistMap = {
  'a1111111-1111-1111-1111-111111111111': { name: 'BTS', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400' },
  'a2222222-2222-2222-2222-222222222222': { name: 'BLACKPINK', img: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400' },
  'a3333333-3333-3333-3333-333333333333': { name: 'TWICE', img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400' },
  'a4444444-4444-4444-4444-444444444444': { name: 'IU', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  'a5555555-5555-5555-5555-555555555555': { name: 'Stray Kids', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400' },
  'a6666666-6666-6666-6666-666666666666': { name: 'aespa', img: 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400' },
  'a7777777-7777-7777-7777-777777777777': { name: 'SEHUN', img: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400' },
  'a8888888-8888-8888-8888-888888888888': { name: 'NCT Dream', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400' },
  'a9999999-9999-9999-9999-999999999999': { name: 'IVE', img: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400' },
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': { name: 'KAZUHA', img: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400' },
};

const eventMap = {
  'e1111111-1111-1111-1111-111111111111': { name: 'BTS Concert', img: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800' },
  'e2222222-2222-2222-2222-222222222222': { name: 'BLACKPINK Concert', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800' },
  'e3333333-3333-3333-3333-333333333333': { name: 'TWICE Fanmeeting', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800' },
  'e4444444-4444-4444-4444-444444444444': { name: 'IU Concert', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800' },
  'e5555555-5555-5555-5555-555555555555': { name: 'Stray Kids Concert', img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800' },
};

fs.mkdirSync('public/images/artists', { recursive: true });
fs.mkdirSync('public/images/events', { recursive: true });
fs.mkdirSync('public/images/news', { recursive: true });

async function main() {
  console.log('🚀 开始全自动图片上传...\n');
  
  // 1. 上传艺人图片
  console.log('=== 艺人头像 ===');
  for (const [id, {name, img}] of Object.entries(artistMap)) {
    const filename = `public/images/artists/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    console.log(`上传 ${name}...`);
    const downloaded = await downloadImage(img, filename);
    if (downloaded) {
      const storagePath = `artists/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      const url = await uploadToStorage(downloaded, storagePath);
      if (url) {
        await supabase.from('artists').update({ profile_image: url }).eq('id', id);
        console.log(`  ✅ ${url}`);
      }
    }
  }
  
  // 2. 上传活动海报
  console.log('\n=== 活动海报 ===');
  for (const [id, {name, img}] of Object.entries(eventMap)) {
    const filename = `public/images/events/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    console.log(`上传 ${name}...`);
    const downloaded = await downloadImage(img, filename);
    if (downloaded) {
      const storagePath = `events/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      const url = await uploadToStorage(downloaded, storagePath);
      if (url) {
        await supabase.from('events').update({ poster_image: url }).eq('id', id);
        console.log(`  ✅ ${url}`);
      }
    }
  }
  
  // 3. 上传新闻图片
  console.log('\n=== 新闻图片 ===');
  const newsImages = [
    'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=800',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  ];
  
  const { data: news } = await supabase.from('news').select('id').limit(30);
  for (let i = 0; i < (news?.length || 0); i++) {
    const item = news[i];
    const imgUrl = newsImages[i % newsImages.length];
    const filename = `public/images/news/news-${i}.jpg`;
    const downloaded = await downloadImage(imgUrl, filename);
    if (downloaded) {
      const storagePath = `news/news-${i}.jpg`;
      const url = await uploadToStorage(downloaded, storagePath);
      if (url) {
        await supabase.from('news').update({ image_url: url }).eq('id', item.id);
        console.log(`  ✅ 新闻${i+1} -> ${url.substring(0,60)}`);
      }
    }
  }
  
  console.log('\n\n=== 验证数据库 ===');
  const { data: artists } = await supabase.from('artists').select('name_zh, profile_image');
  console.log('艺人:');
  artists?.forEach(a => console.log(`  ${a.name_zh}: ${a.profile_image?.substring(0,70)}`));
  
  const { data: events } = await supabase.from('events').select('title, poster_image');
  console.log('活动:');
  events?.forEach(e => console.log(`  ${e.title}: ${e.poster_image?.substring(0,70)}`));
  
  const { data: newsData } = await supabase.from('news').select('title, image_url').limit(5);
  console.log('新闻:');
  newsData?.forEach(n => console.log(`  ${n.title.substring(0,40)}: ${n.image_url?.substring(0,70)}`));
  
  console.log('\n✅ 全部完成!');
}

main().catch(console.error);