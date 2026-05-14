#!/usr/bin/env node
/**
 * Pinterest KPOP Image Auto-Downloader
 * Uses agent-browser to download real artist/event images
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/Users/tbndemac/Documents/金会杰/网站/kpop-images';

const ARTISTS = [
  { name: 'BTS', search: 'BTS official group photo 2024' },
  { name: 'BLACKPINK', search: 'BLACKPINK official group photo 2024' },
  { name: 'TWICE', search: 'TWICE official group photo 2024' },
  { name: 'IU', search: 'IU singer official photo 2024' },
  { name: 'Stray Kids', search: 'Stray Kids official group 2024' },
  { name: 'aespa', search: 'aespa official group photo 2024' },
  { name: 'SEHUN', search: 'SEHUN EXO official photo 2024' },
  { name: 'NCT Dream', search: 'NCT Dream official group 2024' },
  { name: 'IVE', search: 'IVE official group photo 2024' },
  { name: 'KAZUHA', search: 'KAZUHA LE SSERAFIM photo 2024' },
];

const EVENTS = [
  { name: 'BTS Concert', search: 'BTS concert tour poster 2024' },
  { name: 'BLACKPINK Concert', search: 'BLACKPINK concert poster 2024' },
  { name: 'TWICE Fanmeeting', search: 'TWICE fanmeeting poster 2024' },
  { name: 'IU Concert', search: 'IU concert poster 2024' },
  { name: 'Stray Kids Concert', search: 'Stray Kids concert poster 2024' },
];

function run(cmd, timeout = 45000) {
  console.log(`  > ${cmd.substring(0, 80)}...`);
  try {
    const result = execSync(cmd, { 
      encoding: 'utf8', 
      timeout,
      cwd: '/Users/tbndemac/Documents/金会杰/创业调研/kpop-platform'
    });
    return result.trim();
  } catch (e) {
    return `ERROR: ${e.message.substring(0, 100)}`;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function downloadArtistImage(artist) {
  try {
    console.log(`\n📥 ${artist.name}...`);
    
    // Step 1: Open Pinterest search
    const encodedQuery = encodeURIComponent(artist.search);
    run(`npx agent-browser open "https://www.pinterest.com/search/?q=${encodedQuery}"`, 30000);
    await sleep(3000);
    
    // Step 2: Wait for page to load
    run(`npx agent-browser wait --load networkidle`, 15000);
    await sleep(1000);
    
    // Step 3: Get first image URL from search results
    const imgUrl = run(`npx agent-browser eval "
      (() => {
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
          if (img.src && img.src.includes('pinimg') && img.naturalWidth > 200) {
            return img.src;
          }
        }
        // Try data-src
        for (const img of document.querySelectorAll('[data-src]')) {
          const src = img.getAttribute('data-src');
          if (src && src.includes('pinimg')) return src;
        }
        return null;
      })()
    "`, 15000);
    
    if (imgUrl && imgUrl.startsWith('http') && !imgUrl.includes('ERROR')) {
      console.log(`  ✅ Found: ${imgUrl.substring(0, 60)}...`);
      
      // Step 4: Open the image page
      run(`npx agent-browser open "${imgUrl}"`, 20000);
      await sleep(2000);
      
      // Step 5: Take screenshot of the image
      const filename = `${artist.name.toLowerCase().replace(' ', '-')}.jpg`;
      const outputPath = `${OUTPUT_DIR}/artists/${filename}`;
      
      // Save the current page as image
      run(`npx agent-browser screenshot "${outputPath}"`, 20000);
      
      // Check file size
      await sleep(1000);
      try {
        const stats = fs.statSync(outputPath);
        console.log(`  ✅ Saved: ${filename} (${(stats.size / 1024).toFixed(0)} KB)`);
      } catch {
        console.log(`  ⚠️ File may not have saved properly`);
      }
    } else {
      console.log(`  ❌ No image found`);
    }
    
    await sleep(1500);
    
  } catch (e) {
    console.log(`  ❌ Error: ${e.message.substring(0, 100)}`);
  }
}

async function downloadEventImage(event) {
  try {
    console.log(`\n📥 ${event.name}...`);
    
    const encodedQuery = encodeURIComponent(event.search);
    run(`npx agent-browser open "https://www.pinterest.com/search/?q=${encodedQuery}"`, 30000);
    await sleep(3000);
    
    run(`npx agent-browser wait --load networkidle`, 15000);
    await sleep(1000);
    
    const imgUrl = run(`npx agent-browser eval "
      (() => {
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
          if (img.src && img.src.includes('pinimg') && img.naturalWidth > 300) {
            return img.src;
          }
        }
        return null;
      })()
    "`, 15000);
    
    if (imgUrl && imgUrl.startsWith('http') && !imgUrl.includes('ERROR')) {
      console.log(`  ✅ Found: ${imgUrl.substring(0, 60)}...`);
      
      const filename = `${event.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')}.jpg`;
      const outputPath = `${OUTPUT_DIR}/events/${filename}`;
      
      run(`npx agent-browser open "${imgUrl}"`, 20000);
      await sleep(2000);
      run(`npx agent-browser screenshot "${outputPath}"`, 20000);
      
      console.log(`  ✅ Saved: ${filename}`);
    } else {
      console.log(`  ❌ No image found`);
    }
    
    await sleep(1500);
    
  } catch (e) {
    console.log(`  ❌ Error: ${e.message.substring(0, 100)}`);
  }
}

async function main() {
  console.log('🚀 KPOP Image Auto-Downloader');
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  // Create directories
  fs.mkdirSync(`${OUTPUT_DIR}/artists`, { recursive: true });
  fs.mkdirSync(`${OUTPUT_DIR}/events`, { recursive: true });
  
  // Download artist images
  console.log('\n========== ARTISTS ==========');
  for (const artist of ARTISTS) {
    await downloadArtistImage(artist);
  }
  
  console.log('\n========== EVENTS ==========');
  for (const event of EVENTS) {
    await downloadEventImage(event);
  }
  
  // List downloaded files
  console.log('\n\n📁 Downloaded artist files:');
  const artistFiles = fs.readdirSync(`${OUTPUT_DIR}/artists`);
  artistFiles.forEach(f => console.log(`  - ${f}`));
  
  console.log('\n📁 Downloaded event files:');
  const eventFiles = fs.readdirSync(`${OUTPUT_DIR}/events`);
  eventFiles.forEach(f => console.log(`  - ${f}`));
  
  console.log('\n✨ Done!');
}

main().catch(console.error);