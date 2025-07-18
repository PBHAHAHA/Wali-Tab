/// <reference types="vite/client" />
/// <reference types="chrome" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 扩展 Window 接口
declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__?: any
  }
}

export {} 