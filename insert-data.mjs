import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const artists = [
  { id: 'a1111111-1111-1111-1111-111111111111', name_ko: '방탄소년단', name_zh: '防弹少年团', name_en: 'BTS', agency: 'HYBE', country: 'KR', hot_score: 9850, profile_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', slug: 'bts', artist_type: 'group', member_count: 7, tags: ['kpop', 'hip-hop'], status: 'active' },
  { id: 'a2222222-2222-2222-2222-222222222222', name_ko: '블랙핑크', name_zh: 'BLACKPINK', name_en: 'BLACKPINK', agency: 'YG Entertainment', country: 'KR', hot_score: 9720, profile_image: 'https://images.unsplash.com/photo-1533910534207-90f31029a34e?w=400', slug: 'blackpink', artist_type: 'group', member_count: 4, tags: ['kpop', 'pop'], status: 'active' },
  { id: 'a3333333-3333-3333-3333-333333333333', name_ko: '트와이스', name_zh: 'TWICE', name_en: 'TWICE', agency: 'JYP Entertainment', country: 'KR', hot_score: 9580, profile_image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400', slug: 'twice', artist_type: 'group', member_count: 9, tags: ['kpop', 'pop'], status: 'active' },
  { id: 'a4444444-4444-4444-4444-444444444444', name_ko: '아이유', name_zh: 'IU', name_en: 'IU', agency: 'EDAM Entertainment', country: 'KR', hot_score: 9450, profile_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', slug: 'iu', artist_type: 'solo', member_count: 1, tags: ['kpop', 'ballad'], status: 'active' },
  { id: 'a5555555-5555-5555-5555-555555555555', name_ko: '스트레이 키즈', name_zh: 'Stray Kids', name_en: 'Stray Kids', agency: 'JYP Entertainment', country: 'KR', hot_score: 9350, profile_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400', slug: 'stray-kids', artist_type: 'group', member_count: 8, tags: ['kpop', 'hip-hop'], status: 'active' },
  { id: 'a6666666-6666-6666-6666-666666666666', name_ko: '에스파', name_zh: 'aespa', name_en: 'aespa', agency: 'SM Entertainment', country: 'KR', hot_score: 9280, profile_image: 'https://images.unsplash.com/photo-1574401565272-6b453113c3d5?w=400', slug: 'aespa', artist_type: 'group', member_count: 4, tags: ['kpop', 'ai'], status: 'active' },
  { id: 'a7777777-7777-7777-7777-777777777777', name_ko: '세훈', name_zh: 'SEHUN', name_en: 'SEHUN', agency: 'SM Entertainment', country: 'KR', hot_score: 9100, profile_image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400', slug: 'sehun', artist_type: 'solo', member_count: 1, tags: ['kpop', 'hip-hop'], status: 'active' },
  { id: 'a8888888-8888-8888-8888-888888888888', name_ko: '엔시티 드림', name_zh: 'NCT Dream', name_en: 'NCT Dream', agency: 'SM Entertainment', country: 'KR', hot_score: 8750, profile_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400', slug: 'nct-dream', artist_type: 'group', member_count: 6, tags: ['kpop', 'pop'], status: 'active' },
  { id: 'a9999999-9999-9999-9999-999999999999', name_ko: '아이브', name_zh: 'IVE', name_en: 'IVE', agency: 'Starship Entertainment', country: 'KR', hot_score: 8600, profile_image: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400', slug: 'ive', artist_type: 'group', member_count: 6, tags: ['kpop', 'pop'], status: 'active' },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name_ko: '카자흐', name_zh: 'KAZUHA', name_en: 'KAZUHA', agency: 'Source Music', country: 'KR', hot_score: 8500, profile_image: 'https://images.unsplash.com/photo-1529946797575-0f9c6e35fa44?w=400', slug: 'kazuha', artist_type: 'solo', member_count: 1, tags: ['kpop', 'pop'], status: 'active' },
];

const events = [
  { id: 'e1111111-1111-1111-1111-111111111111', title: 'BTS 2026 世界巡演 - 首尔', artist_id: 'a1111111-1111-1111-1111-111111111111', event_type: 'concert', country: 'KR', city: 'Seoul', venue: '奥林匹克体育场', event_date: '2026-06-15T19:00:00', poster_image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800', status: 'ticketing', hot_score: 9800 },
  { id: 'e2222222-2222-2222-2222-222222222222', title: 'BLACKPINK Born Pink 世界巡演 - 首尔', artist_id: 'a2222222-2222-2222-2222-222222222222', event_type: 'concert', country: 'KR', city: 'Seoul', venue: '高尺天空巨蛋', event_date: '2026-08-20T19:00:00', poster_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', status: 'ticketing', hot_score: 9700 },
  { id: 'e3333333-3333-3333-3333-333333333333', title: 'TWICE 5周年粉丝见面会 - 东京', artist_id: 'a3333333-3333-3333-3333-333333333333', event_type: 'fanmeeting', country: 'JP', city: 'Tokyo', venue: '东京巨蛋', event_date: '2026-07-10T14:00:00', poster_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', status: 'ticketing', hot_score: 9200 },
  { id: 'e4444444-4444-4444-4444-444444444444', title: 'IU 2026 亚洲巡演 - 首尔', artist_id: 'a4444444-4444-4444-4444-444444444444', event_type: 'concert', country: 'KR', city: 'Seoul', venue: '综合运动场', event_date: '2026-09-05T19:30:00', poster_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', status: 'upcoming', hot_score: 9500 },
  { id: 'e5555555-5555-5555-5555-555555555555', title: 'Stray Kids DOMINO 巡演 - 首尔', artist_id: 'a5555555-5555-5555-5555-555555555555', event_type: 'concert', country: 'KR', city: 'Seoul', venue: 'KSPO Dome', event_date: '2026-07-25T19:00:00', poster_image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', status: 'ticketing', hot_score: 9300 },
];

console.log('Inserting artists...');
const { error: artistsError } = await supabase.from('artists').upsert(artists, { onConflict: 'id' });
if (artistsError) {
  console.error('Artists error:', artistsError.message);
} else {
  console.log('Artists inserted!');
}

console.log('Inserting events...');
const { error: eventsError } = await supabase.from('events').upsert(events, { onConflict: 'id' });
if (eventsError) {
  console.error('Events error:', eventsError.message);
} else {
  console.log('Events inserted!');
}

// Verify
const { data: artistsData } = await supabase.from('artists').select('id,name_zh');
console.log('Artists count:', artistsData?.length);
const { data: eventsData } = await supabase.from('events').select('id,title');
console.log('Events count:', eventsData?.length);
