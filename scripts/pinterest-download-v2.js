#!/usr/bin/env node
/**
 * Pinterest KPOP Image Downloader - 简化版
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/Users/tbndemac/Documents/金会杰/网站/kpop-images';

const ITEMS = [
  { name: 'BTS', search: 'BTS official group photo 2024', type: 'artist' },
  { name: 'BLACKPINK', search: 'BLACKPINK official group photo', type: 'artist' },
  { name: 'TWICE', search: 'TWICE official group photo', type: 'artist' },
  { name: 'IU', search: 'IU singer official photo', type: 'artist' },
  { name: 'Stray Kids', search: 'Stray Kids official group', type: 'artist' },
  { name: 'aespa', search: 'aespa official group photo', type: 'artist' },
  { name: 'SEHUN', search: 'SEHUN EXO official photo', type: 'artist' },
  { name: 'NCT Dream', search: 'NCT Dream official group', type: 'artist' },
  { name: 'IVE', search: 'IVE official group photo', type: 'artist' },
  { name: 'KAZUHA', search: 'KAZUHA LE SSERAFIM photo', type: 'artist' },
  { name: 'BTS Concert', search: 'BTS concert poster 2024', type: 'event' },
  { name: 'BLACKPINK Concert', search: 'BLACKPINK concert poster', type: 'event' },
  { name: 'TWICE Fanmeeting', search: 'TWICE fanmeeting poster', type: 'event' },
  { name: 'IU Concert', search: 'IU concert poster 2024', type: 'event' },
  { name: 'Stray Kids Concert', search: 'Stray Kids concert poster', type: 'event' },
];

function run(cmd, timeout = 30000) {
  try {
    return execSync(cmd, { 
      encoding: 'utf8', 
      timeout,
      cwd: '/Users/tbndemac/Documents/金会杰/创业调研/kpop-platform'
    }).trim();
  } catch (e) {
    return `ERROR: ${e.message.substring(0, 80)}`;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function downloadItem(item) {
  try {
    console.log(`\n📥 ${item.name}...`);
    
    // Open Pinterest search
    const encodedQuery = encodeURIComponent(item.search);
    run(`npx agent-browser open "https://www.pinterest.com/search/?q=${encodedQuery}"`);
    await sleep(3500);
    
    run(`npx agent-browser wait --load networkidle`);
    await sleep(500);
    
    // Get first pinimg URL from search results
    const imgUrls = run(`npx agent-browser eval "
      (() => {
        const imgs = document.querySelectorAll('img');
        const results = [];
        for (const img of imgs) {
          if (img.src && img.src.includes('pinimg') && img.naturalWidth > 150) {
            results.push(img.src.replace('/236x/', '/736x/'));
            if (results.length >= 3) break;
          }
        }
        return JSON.stringify(results);
      })()
    "`);
    
    if (imgUrls.includes('ERROR') || !imgUrls.startsWith('[')) {
      console.log(`  ❌ 获取图片失败`);
      return false;
    }
    
    const urls = JSON.parse(imgUrls);
    if (urls.length === 0) {
      console.log(`  ❌ 没有找到图片`);
      return false;
    }
    
    // Try first image
    const imgUrl = urls[0];
    console.log(`  📷 ${imgUrl.substring(0, 60)}...`);
    
    // Open image
    run(`npx agent-browser open "${imgUrl}"`);
    await sleep(2000);
    
    // Take screenshot
    const filename = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
    const subdir = item.type === 'artist' ? 'artists' : 'events';
    const outputPath = `${OUTPUT_DIR}/${subdir}/${filename}`;
    
    run(`npx agent-browser screenshot "${outputPath}"`);
    
    // Check file
    try {
      const stats = fs.statSync(outputPath);
      if (stats.size > 5000) {
        console.log(`  ✅ ${filename} (${(stats.size / 1024).toFixed(0)} KB)`);
        return true;
      }
    } catch {}
    
    console.log(`  ❌ 文件无效`);
    return false;
    
  } catch (e) {
    console.log(`  ❌ Error: ${e.message.substring(0, 80)}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Pinterest 图片自动下载器\n');
  
  fs.mkdirSync(`${OUTPUT_DIR}/artists`, { recursive: true });
  fs.mkdirSync(`${OUTPUT_DIR}/events`, { recursive: true });
  
  let success = 0;
  for (const item of ITEMS) {
    const ok = await downloadItem(item);
    if (ok) success++;
    await sleep(800);
  }
  
  // List files
  console.log('\n\n📁 Artists:');
  fs.readdirSync(`${OUTPUT_DIR}/artists`).forEach(f => console.log(`  - ${f}`));
  
  console.log('\n📁 Events:');
  fs.readdirSync(`${OUTPUT_DIR}/events`).forEach(f => console.log(`  - ${f}`));
  
  console.log(`\n✨ 完成! 成功: ${success}/${ITEMS.length}`);
}

main().catch(console.error);