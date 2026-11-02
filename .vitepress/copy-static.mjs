// 빌드 뒤 용어 풀이 html 6장(자체 디자인)을 그대로 복사한다 — VitePress 페이지가 아니라서.
import { cpSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const files = readdirSync(join(root, 'html')).filter((f) => f.endsWith('.html'))
for (const f of files) cpSync(join(root, 'html', f), join(root, '.vitepress', 'dist', 'html', f))
console.log(`[copy-static] html ${files.length}개 복사`)
