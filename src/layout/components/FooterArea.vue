<template>
  <div class="footer" :class="{ 'dark-mode': isDarkMode }">
    🌟
    <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer"
      >浙ICP备</a
    >
    ｜ 🎉 Design by
    <a href="#" class="transition line" onclick="window.location.href = window.location.href"
      >wyx</a
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
const isDarkMode = computed(() => appStore.isDarkMode)
</script>

<style scoped>
a {
  color: #666;
  text-decoration: none;
}

.footer {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  padding: 12px 0;
  transition:
    background-color 0.3s,
    color 0.3s;
  height: 45px;
}

.dark-mode a {
  color: #aaa;
}

.dark-mode {
  color: #aaa;
}

a:hover {
  color: #36ad6a;
}
</style>
