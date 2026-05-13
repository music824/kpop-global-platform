import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Naver API credentials - 需要你提供
const NAVER_CLIENT_ID = 'YOUR_NAVER_CLIENT_ID';
const NAVER_CLIENT_SECRET = 'YOUR_NAVER_CLIENT_SECRET';

// Naver 图片搜索 API
async function searchNaverImage(query) {
  try {
    const response = await fetch(`https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(query)}&display=5&start=1`, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
      }
    });
    const data = await response.json();
    return data.items?.[0]?.thumbnail_url || null;
  } catch (err) {
    console.log('Naver search failed:', err.message);
    return null;
  }
}

// 测试 Naver API
async function testNaver() {
  const result = await searchNaverImage('BTS 防弹少年团');
  console.log('Naver result:', result);
}

// 先测试 Naver API 是否可用
testNaver().catch(console.error);
