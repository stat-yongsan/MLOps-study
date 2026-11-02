import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    // 용어 풀이 html 은 VitePress 페이지가 아니므로 화면 안 이동 대신 그 파일을 직접 연다.
    router.onBeforeRouteChange = (to) => {
      if (typeof window !== 'undefined' && /\/html\/(?!index\.html)[^/]+\.html(#.*)?$/.test(to)) {
        window.location.assign(to)
        return false
      }
    }
  },
} satisfies Theme
