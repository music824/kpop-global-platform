#!/usr/bin/env node
/**
 * Pinterest Image Downloader for KPOP Artists
 * Uses agent-browser to access Pinterest (works with VPN)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTISTS = [
  { name: 'BTS', search: 'BTS official group photo', filename: 'bts.jpg' },
  { name: 'BLACKPINK', search: 'BLACKPINK official group photo', filename: 'blackpink.jpg' },
  { name: 'TWICE', search: 'TWICE official group photo', filename: 'twice.jpg' },
  { name: 'IU', search: 'IU singer official photo', filename: 'iu.jpg' },
  { name: 'Stray Kids', search: 'Stray Kids official group', filename: 'stray-kids.jpg' },
  { name: 'aespa', search: 'aespa official group photo', filename: 'aespa.jpg' },
  { name: 'SEHUN', search: 'SEHUN EXO official photo', filename: 'sehun.jpg' },
  { name: 'NCT Dream', search: 'NCT Dream official group', filename: 'nct-dream.jpg' },
  { name: 'IVE', search: 'IVE official group photo', filename: 'ive.jpg' },
  { name: 'KAZUHA', search: 'KAZUHA LE SSERAFIM photo', filename: 'kazuha.jpg' },
];

const EVENTS = [
  { name: 'BTS Concert', search: 'BTS concert poster 2024', filename: 'bts-concert.jpg' },
  { name: 'BLACKPINK Concert', search: 'BLACKPINK concert poster', filename: 'blackpink-concert.jpg' },
  { name: 'TWICE Fanmeeting', search: 'TWICE fanmeeting poster', filename: 'twice-fanmeeting.jpg' },
  { name: 'IU Concert', search: 'IU concert poster 2024', filename: 'iu-concert.jpg' },
  { name: 'Stray Kids Concert', search: 'Stray Kids concert poster', filename: 'stray-kids-concert.jpg' },
];

const OUTPUT_DIR = '/Users/tbndemac/Documents/金会杰/网站/kpop-images';

function run(cmd) {
  console.log(`> ${cmd}`);
  const result = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
  return result;
}

function extractImgUrl(html) {
  // Try og:image
  const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (ogMatch) return ogMatch[1];
  
  // Try twitter:image
  const twitterMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/);
  if (twitterMatch) return twitterMatch[1];
  
  // Try data-src for lazy loaded images
  const dataMatch = html.match(/data-src="([^"]+\.(jpg|jpeg|png))"/i);
  if (dataMatch) return dataMatch[1];
  
  // Try src
  const srcMatch = html.match(/src="([^"]+\.(jpg|jpeg|png))"/i);
  if (srcMatch) return srcMatch[1];
  
  return null;
}

async function downloadFromPinterest(searchQuery, filename) {
  try {
    console.log(`\n📥 Searching: ${searchQuery}`);
    
    // Open Pinterest search
    const encodedQuery = encodeURIComponent(searchQuery);
    run(`npx agent-browser open "https://www.pinterest.com/search/?q=${encodedQuery}"`);
    
    // Wait and get page content
    await new Promise(r => setTimeout(r, 3000));
    run(`npx agent-browser wait --load networkidle`);
    
    // Get the first image URL from the page
    const imgUrl = run(`npx agent-browser eval "document.querySelector('img')?.src"`).trim();
    
    if (imgUrl && imgUrl.startsWith('http')) {
      console.log(`  Found: ${imgUrl}`);
      
      // Navigate to image directly
      run(`npx agent-browser open "${imgUrl}"`);
      await new Promise(r => setTimeout(r, 2000));
      
      // Save screenshot
      const outputPath = path.join(OUTPUT_DIR, 'artists', filename);
      run(`npx agent-browser screenshot ${outputPath}`);
      
      console.log(`  ✅ Saved: ${outputPath}`);
      return true;
    } else {
      console.log(`  ❌ No image found`);
      return false;
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Pinterest Image Downloader for KPOP');
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  // Create directories
  fs.mkdirSync(path.join(OUTPUT_DIR, 'artists'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'events'), { recursive: true });
  
  // Download artist images
  console.log('\n========== ARTISTS ==========');
  for (const artist of ARTISTS) {
    await downloadFromPinterest(artist.search, artist.filename);
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Download event images
  console.log('\n========== EVENTS ==========');
  for (const event of EVENTS) {
    await downloadFromPinterest(event.search, event.filename);
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n✨ Done!');
  
  // List downloaded files
  console.log('\n📁 Downloaded files:');
  const files = fs.readdirSync(path.join(OUTPUT_DIR, 'artists'));
  files.forEach(f => console.log(`  - ${f}`));
}

main().catch(console.error);