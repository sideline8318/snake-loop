const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const wasmNative = path.join(root, 'node_modules', '@rollup', 'wasm-node', 'dist', 'native.js');
const rollupNative = path.join(root, 'node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(wasmNative) && fs.existsSync(rollupNative)) {
  fs.writeFileSync(rollupNative, "module.exports = require('@rollup/wasm-node/dist/native.js');\n");
}
