<template>
  <div class="error-page">
    <div class="error-content">
      <n-card class="error-card" size="huge" :bordered="false">
        <n-result status="403" title="403 访问被禁止" description="抱歉，您没有权限访问此页面">
          <template #footer>
            <div class="error-actions">
              <n-button @click="goHome" type="primary">返回首页</n-button>
              <n-button @click="goBack">返回上一页</n-button>
            </div>
          </template>
        </n-result>
      </n-card>

      <div class="error-footer">
        <p>© {{ currentYear }} 后台管理系统</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ForbiddenPage',
}
</script>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NResult, NButton, NCard } from 'naive-ui'
import { ref } from 'vue'

const router = useRouter()
const currentYear = ref(new Date().getFullYear())

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
  background-color: #fff1f0;
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background-color: #fff;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.error-footer {
  margin-top: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
