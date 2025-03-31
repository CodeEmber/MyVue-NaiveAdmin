<template>
  <div class="dashboard-container">
    <!-- 实时监控面板 -->
    <n-card title="实时监控面板" class="mb-16">
      <n-grid cols="2 s:2 m:4" :x-gap="16" :y-gap="16">
        <n-grid-item v-for="(stat, index) in realtimeStats" :key="index">
          <n-statistic :label="stat.title" :value="stat.value">
            <template #prefix v-if="stat.icon">
              <n-icon :component="stat.icon" />
            </template>
            <template #suffix v-if="stat.trend">
              <n-tag :type="stat.trend.type" size="small">{{ stat.trend.text }}</n-tag>
            </template>
          </n-statistic>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 性能监测 -->
    <n-card title="系统性能监测" class="mt-16">
      <n-grid cols="1 m:2" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <n-statistic label="CPU使用率">
            <n-progress
              type="line"
              :percentage="cpuUsage"
              :color="getCpuColor(cpuUsage)"
              :height="12"
            />
            <div style="margin-top: 8px">{{ cpuUsage }}%</div>
          </n-statistic>
        </n-grid-item>
        <n-grid-item>
          <n-statistic label="内存使用率">
            <n-progress
              type="line"
              :percentage="memoryUsage"
              :color="getMemoryColor(memoryUsage)"
              :height="12"
            />
            <div style="margin-top: 8px">
              {{ memoryUsage }}% ({{ usedMemory }} / {{ totalMemory }})
            </div>
          </n-statistic>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 最近异常记录 -->
    <n-card title="最近系统日志" class="mt-16">
      <n-list hoverable>
        <n-list-item v-for="(log, index) in systemLogs" :key="index">
          <n-thing :title="log.title" :description="log.description">
            <template #header-extra>
              <n-tag
                :type="
                  log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'default'
                "
              >
                {{ log.level.toUpperCase() }}
              </n-tag>
            </template>
            <template #footer>
              <n-space>
                <n-icon :component="TimeOutline" />
                <span>{{ log.time }}</span>
                <n-divider vertical />
                <n-icon :component="PersonOutline" />
                <span>{{ log.user }}</span>
                <n-divider vertical />
                <n-icon :component="LocationOutline" />
                <span>{{ log.ip }}</span>
              </n-space>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
      <div class="text-center mt-16">
        <n-button text>查看全部日志</n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import {
  PersonOutline,
  TimeOutline,
  LocationOutline,
  PulseOutline,
  SpeedometerOutline,
  EyeOutline,
} from '@vicons/ionicons5'

// 使用markRaw处理图标组件，避免被设为响应式对象
const personOutlineIcon = markRaw(PersonOutline)
const pulseOutlineIcon = markRaw(PulseOutline)
const speedometerOutlineIcon = markRaw(SpeedometerOutline)
const eyeOutlineIcon = markRaw(EyeOutline)

// 实时监控数据
const realtimeStats = ref([
  {
    title: '当前在线',
    value: '328',
    icon: personOutlineIcon,
    trend: { type: 'success', text: '+12%' },
  },
  {
    title: '今日访问量',
    value: '3,428',
    icon: eyeOutlineIcon,
    trend: { type: 'success', text: '+5%' },
  },
  {
    title: '服务器响应时间',
    value: '128ms',
    icon: speedometerOutlineIcon,
  },
  {
    title: '今日API调用',
    value: '15,632',
    icon: pulseOutlineIcon,
    trend: { type: 'info', text: '+2%' },
  },
])

// 系统性能数据
const cpuUsage = ref(42)
const memoryUsage = ref(60)
const totalMemory = ref('8.0 GB')
const usedMemory = ref('4.8 GB')

// 系统日志数据
const systemLogs = ref([
  {
    title: '登录失败',
    description: '用户多次登录失败，IP已被临时封禁',
    level: 'warning',
    time: '2025-03-30 10:42:15',
    user: 'unknown',
    ip: '192.168.1.101',
  },
  {
    title: '数据库连接异常',
    description: '数据库连接池出现超时问题，已自动恢复',
    level: 'error',
    time: '2025-03-30 09:15:30',
    user: 'system',
    ip: '127.0.0.1',
  },
  {
    title: '系统备份完成',
    description: '每日系统数据备份已完成',
    level: 'info',
    time: '2025-03-30 03:00:00',
    user: 'system',
    ip: '127.0.0.1',
  },
])

// 获取CPU使用率颜色
const getCpuColor = (usage: number) => {
  if (usage < 50) return '#18a058'
  if (usage < 80) return '#f0a020'
  return '#d03050'
}

// 获取内存使用率颜色
const getMemoryColor = (usage: number) => {
  if (usage < 60) return '#18a058'
  if (usage < 85) return '#f0a020'
  return '#d03050'
}
</script>

<style scoped>
.dashboard-container {
  padding: 16px;
}

.mt-16 {
  margin-top: 16px;
}

.mb-16 {
  margin-bottom: 16px;
}

.text-center {
  text-align: center;
}
</style>
