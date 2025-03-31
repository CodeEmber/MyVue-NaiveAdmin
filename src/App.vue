<script setup lang="ts">
import { useAppStore } from './stores/app'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  darkTheme,
  lightTheme,
} from 'naive-ui'
import { computed, onMounted, watch } from 'vue'
import { initVChartTheme, updateVChartTheme } from './utils/chart/theme'

const appStore = useAppStore()
const theme = computed(() => (appStore.isDarkMode ? darkTheme : lightTheme))
const themeOverrides = computed(() => appStore.themeOverrides)

// 初始化VChart主题
onMounted(() => {
  initVChartTheme(appStore.isDarkMode)
})

// 监听主题变化，实时更新VChart主题
watch(
  () => appStore.isDarkMode,
  (newIsDark) => {
    updateVChartTheme(newIsDark)
  },
)
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" class="n-config-provider">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <router-view />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
@import './styles/global.css';

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  margin: 0;
  padding: 0;
}

.n-config-provider {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.n-loading-bar-container,
.n-dialog-container,
.n-notification-container,
.n-message-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
