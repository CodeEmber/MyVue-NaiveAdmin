/// <reference types="vite/client" />

// 声明Vue模块，解决TypeScript无法识别.vue文件的问题
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
