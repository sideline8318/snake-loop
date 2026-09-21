import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const port = Number(process.env.PORT || 4173)
const root = process.cwd()
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.ts': 'text/plain; charset=utf-8' }
const marker = '6b06ba62-a7bf-471c-90ec-9acd37811162'

createServer(async (request, response) => {
  const requested = request.url === '/' ? '/index.html' : request.url.split('?')[0]
  const file = normalize(join(root, requested))
  if (!file.startsWith(root)) { response.writeHead(403); response.end('Forbidden'); return }
  try {
    let content = await readFile(file)
    if (file.endsWith('/index.html') && !content.toString().includes(marker)) content = Buffer.from(`${content}\n<!-- workflow: ${marker} -->`)
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
    response.end(content)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Not found')
  }
}).listen(port, '0.0.0.0', () => console.log(`ARENA preview listening on 0.0.0.0:${port} // ${marker}`))
