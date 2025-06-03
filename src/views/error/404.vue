<template>
  <div class="error-page">
    <div class="error-content">
      <n-card class="error-card" size="huge" :bordered="false">
        <n-result
          status="404"
          :title="t('errors.notFound')"
          :description="t('errors.notFoundDesc')"
        >
          <template #footer>
            <div class="error-actions">
              <n-button @click="goHome" type="primary">{{ t('errors.backHome') }}</n-button>
              <n-button @click="goBack">{{ t('errors.backPrev') }}</n-button>
            </div>
          </template>
        </n-result>
      </n-card>

      <div class="error-footer">
        <p>© {{ currentYear }} {{ t('app.title') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NotFoundPage',
}
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton, NCard } from 'naive-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

// 初始化i18n
const { t } = useI18n()

const router = useRouter()
const currentYear = ref(new Date().getFullYear())

// 获取主题状态
const appStore = useAppStore()
const { isDarkMode } = storeToRefs(appStore)

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: v-bind('isDarkMode ? "#18181c" : "#f8f9fa"');
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.error-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.error-card {
  max-width: 600px;
  width: 100%;
  box-shadow: v-bind(
    'isDarkMode ? "0 4px 16px rgba(0, 0, 0, 0.4)" : "0 4px 16px rgba(0, 0, 0, 0.08)"'
  );
  border-radius: 8px;
  background-color: v-bind('isDarkMode ? "#242424" : "#fff"');
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.error-footer {
  margin-top: 40px;
  text-align: center;
  color: v-bind('isDarkMode ? "#999" : "#666"');
  font-size: 14px;
}
</style>
