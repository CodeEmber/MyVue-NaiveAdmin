<template>
  <section class="app-main" :class="{ 'dark-mode': isDarkMode }">
    <n-back-top :right="100" />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { NBackTop } from 'naive-ui'
import { computed } from 'vue'
import { useAppStore } from '../../stores/app'

const appStore = useAppStore()
const isDarkMode = computed(() => appStore.isDarkMode)
</script>

<style scoped>
.app-main {
  padding: 15px;
  flex: 1; /* 填充可用空间 */
  display: flex;
  flex-direction: column;
  background-color: #f5f7f9;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.dark-mode {
  background-color: #121212;
  color: #e5e5e5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
