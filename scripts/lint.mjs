import fs from 'node:fs';

const files = ['game.js', 'vite.config.js'];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  if (/console\.log\(/.test(source)) throw new Error(`${file}: remove console.log`);
  if (/\t/.test(source)) throw new Error(`${file}: tabs are not allowed`);
}
console.log(`lint passed: ${files.join(', ')}`);
