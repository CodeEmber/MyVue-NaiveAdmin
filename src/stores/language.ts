import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  // 默认从 localStorage 或浏览器设置获取初始语言
  const getCurrentLanguage = (): string => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      return savedLanguage
    }
    // 获取浏览器语言
    const browserLang = navigator.language.toLowerCase()
    return browserLang.includes('zh') ? 'zh-CN' : 'en-US'
  }

  // 当前语言
  const currentLanguage = ref<string>(getCurrentLanguage())

  // 可用语言列表
  const availableLanguages = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' },
  ]

  // 设置当前语言（不处理i18n实例，只在store中记录并保存到localStorage）
  function setCurrentLanguage(lang: string) {
    currentLanguage.value = lang
    // 保存到 localStorage
    localStorage.setItem('language', lang)
    return lang
  }

  return {
    currentLanguage,
    availableLanguages,
  }
})
