import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://olyehtdnvicgcxsdvcfv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9seWVodGRudmljZ2N4c2R2Y2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MDU0MjAsImV4cCI6MjA5NDE4MTQyMH0.MbW4LmQSjAvShtHSqSph7dYLjAgx8jkJ8Nn1Vbc_oD4'
);

async function check() {
  console.log('=== ARTISTS ===');
  const { data: artists } = await supabase
    .from('artists')
    .select('name_en, profile_image')
    .order('hot_score', { ascending: false });
  
  artists?.forEach(a => {
    console.log(`${a.name_en}: ${a.profile_image}`);
  });
  
  console.log('\n=== EVENTS ===');
  const { data: events } = await supabase
    .from('events')
    .select('title, poster_image')
    .limit(5);
  
  events?.forEach(e => {
    console.log(`${e.title.substring(0, 30)}: ${e.poster_image}`);
  });
}

check();
