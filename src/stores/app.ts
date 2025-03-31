import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { darkThemeOverrides, lightThemeOverrides, createThemeOverrides } from '../styles/theme'

export const useAppStore = defineStore('app', () => {
  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)

  // 主题模式，'light'或'dark'
  const themeMode = ref<'light' | 'dark'>('light')

  // 主题色
  const primaryColor = ref('#18a058')

  // 计算属性：是否为暗黑模式
  const isDarkMode = computed(() => themeMode.value === 'dark')

  // 计算属性：当前主题覆盖配置
  const themeOverrides = computed(() => createThemeOverrides(primaryColor.value, isDarkMode.value))

  // 切换侧边栏折叠状态
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 切换主题模式
  function toggleThemeMode() {
    themeMode.value = isDarkMode.value ? 'light' : 'dark'
  }

  // 设置主题色
  function setPrimaryColor(color: string) {
    primaryColor.value = color
  }

  return {
    sidebarCollapsed,
    themeMode,
    primaryColor,
    isDarkMode,
    themeOverrides,
    toggleSidebar,
    toggleThemeMode,
    setPrimaryColor,
  }
})
