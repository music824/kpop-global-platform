import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const images = [
  'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=800',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
];

async function main() {
  const { data: news } = await supabase.from('news').select('id');
  
  for (let i = 0; i < (news?.length || 0); i++) {
    const item = news[i];
    const imgUrl = images[i % images.length];
    await supabase.from('news').update({ image_url: imgUrl }).eq('id', item.id);
    console.log(`更新新闻 ${i+1}/${news.length}: ${item.id.substring(0,20)}... -> ${imgUrl.substring(0,50)}`);
  }
  
  // 验证
  const { data: check } = await supabase.from('news').select('id, title, image_url').limit(5);
  console.log('\n验证结果:');
  check?.forEach(n => console.log(`  ${n.title.substring(0,35)}: ${n.image_url || 'NULL'}`));
}

main().catch(console.error);
