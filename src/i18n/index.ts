import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 获取浏览器语言
const getBrowserLanguage = (): string => {
  const language = navigator.language.toLowerCase()
  // 可以根据需要添加更多的语言判断
  if (language.includes('zh')) {
    return 'zh-CN'
  }
  return 'en-US'
}

// 获取本地存储的语言或使用浏览器语言
const getLanguage = (): string => {
  return localStorage.getItem('language') || getBrowserLanguage()
}

const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: getLanguage(),
  fallbackLocale: 'zh-CN', // 找不到对应语言时的回退语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export default i18n
