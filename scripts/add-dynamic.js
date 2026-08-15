#!/usr/bin/env node
/**
 * add-dynamic.js
 * 一键新增「动态/说说」到 source/_data/dynamics.yml 顶部（保持日期倒序）
 *
 * 用法：
 *   node scripts/add-dynamic.js "内容"
 *   node scripts/add-dynamic.js "内容" 2026-08-15
 *   npm run dynamic -- "内容"          （推荐，等价于上面）
 *
 * 内容支持 Markdown；多行内容用 \n 分隔（引号包裹）。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'source', '_data', 'dynamics.yml');

// 参数解析
const args = process.argv.slice(2);
if (!args.length || !args[0]) {
  console.error('❌ 用法：node scripts/add-dynamic.js "动态内容" [日期YYYY-MM-DD]');
  process.exit(1);
}

const content = args[0].replace(/\\n/g, '\n').trim();
let date = args[1] || '';
if (!date) {
  const d = new Date();
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  date = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

if (!fs.existsSync(filePath)) {
  console.error('❌ 找不到 dynamics.yml：' + filePath);
  process.exit(1);
}

let raw = fs.readFileSync(filePath, 'utf8').trim();

// 生成新条目
let entry;
if (content.includes('\n') || /^[-*#>:|&!@`]/.test(content) || content.includes(': ')) {
  // 多行 / 特殊字符 → 用 YAML 块标量
  const lines = content.split('\n').map((l) => '  ' + l).join('\n');
  entry = '- date: ' + date + '\n  content: |-\n' + lines;
} else {
  entry = '- date: ' + date + '\n  content: ' + content;
}

// 插入顶部
raw = entry + '\n\n' + raw + '\n';

fs.writeFileSync(filePath, raw, 'utf8');

console.log('✅ 动态已添加：');
console.log('   ' + entry.replace(/\n/g, '\n   '));
console.log('\n👉 文件已更新：source/_data/dynamics.yml');
console.log('👉 请 git add/commit/push 到远端，构建后刷新 /mys/ 首页或 /mys/dynamics/ 查看。');
