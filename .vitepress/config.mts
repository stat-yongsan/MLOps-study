import { defineConfig } from 'vitepress'
import { dirname, resolve } from 'node:path'
import { readdirSync } from 'node:fs'

const repo = 'https://github.com/stat-yongsan/MLOps-study'
// 용어 풀이 html 파일 이름(확장자 뺀 것) — 링크 검사에서 「없는 페이지」로 보지 않게
const termPages = new Set(
  readdirSync(resolve(__dirname, '..', 'html'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.slice(0, -5)),
)

// 원래 md 는 그대로 두고 주소만 바꾼다(README.md → 각 폴더의 첫 페이지).
// html/*.html 용어 풀이 6장은 빌드 뒤 copy-static.mjs 가 그대로 복사한다.
export default defineConfig({
  base: '/MLOps-study/',
  lang: 'ko-KR',
  title: 'MLOps 스터디',
  description: 'Machine Learning Platform Engineering Study',
  appearance: false, // 참고 사이트처럼 항상 밝은 테마
  lastUpdated: false,
  rewrites: {
    'README.md': 'index.md',
    'week1/README.md': 'week1/index.md',
    'week1/README2.md': 'week1/lab.md',
    'week2/README.md': 'week2/index.md',
    'html/README.md': 'html/index.md',
  },
  // 용어 풀이 html 은 VitePress 페이지가 아니라 복사한 정적 파일이다.
  ignoreDeadLinks: [(url) => termPages.has(url.split(/[?#]/)[0].split('/').pop()!.replace(/\.html$/, ''))],
  vite: {
    plugins: [
      {
        // README 의 <img src="images/..."> 를 그 md 가 있는 폴더 기준으로 찾는다(원문은 안 고침).
        name: 'study-relative-images',
        resolveId(id, importer) {
          if (importer && id.startsWith('images/')) return resolve(dirname(importer.split('?')[0]), id)
        },
      },
    ],
  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap' }],
  ],
  themeConfig: {
    nav: [
      { text: '소개', link: '/' },
      { text: '1주차', link: '/week1/' },
      { text: '2주차', link: '/week2/' },
      { text: '용어 풀이', link: '/html/' },
    ],
    sidebar: [
      { text: 'MLOps 스터디', items: [{ text: '소개 · 노트', link: '/' }] },
      {
        text: '1주차 · CH1~3',
        items: [
          { text: 'CH1~3 정리', link: '/week1/' },
          { text: '3장 실습 한 줄 정리', link: '/week1/lab' },
        ],
      },
      { text: '2주차 · CH4~5', items: [{ text: 'CH4~5 정리', link: '/week2/' }] },
      {
        text: '용어 풀이 · 00~05장',
        items: [
          { text: '목록', link: '/html/' },
          { text: '00 · 책 지도', link: '/html/00-book-map.html' },
          { text: '01 · 시작하기', link: '/html/01-getting-started.html' },
          { text: '02 · MLOps란', link: '/html/02-what-is-mlops.html' },
          { text: '03 · 쿠버네티스 기반', link: '/html/03-kubernetes-foundation.html' },
          { text: '04 · 실험 · 피처 · 파이프라인', link: '/html/04-experiments-features-pipelines.html' },
          { text: '05 · KFP 배치 추론', link: '/html/05-kfp-batch-inference.html' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: repo }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '검색', buttonAriaLabel: '검색' },
          modal: {
            displayDetails: '자세히',
            resetButtonTitle: '지우기',
            backButtonTitle: '닫기',
            noResultsText: '결과가 없습니다',
            footer: { selectText: '열기', navigateText: '이동', closeText: '닫기' },
          },
        },
      },
    },
    outline: { level: [2, 3], label: '이 페이지에서' },
    editLink: { pattern: `${repo}/edit/main/:path`, text: 'GitHub에서 이 페이지 고치기' },
    docFooter: { prev: '이전', next: '다음' },
    sidebarMenuLabel: '메뉴',
    returnToTopLabel: '맨 위로',
    notFound: { title: '페이지를 찾을 수 없습니다', quote: '주소를 다시 확인해 주세요.', linkText: '처음으로' },
  },
})
