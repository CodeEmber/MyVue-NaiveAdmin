<template>
  <div class="dashboard-container">
    <div class="welcome-header mb-16">
      <n-card>
        <n-space align="center">
          <n-avatar round size="large" src="https://placeholder.pics/svg/100/4080FF-FFFFFF/首页" />
          <div>
            <h2 class="welcome-title">欢迎回来，管理员</h2>
            <p class="welcome-subtitle">今天是 {{ currentDate }}，祝您工作愉快！</p>
          </div>
        </n-space>
      </n-card>
    </div>

    <!-- 顶部统计卡片区域 -->
    <n-grid cols="2 s:2 m:4" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="(stat, index) in topStats" :key="index">
        <n-card class="stat-card">
          <n-space vertical>
            <div class="stat-header">
              <span class="stat-title">{{ stat.title }}</span>
              <n-icon size="20" :component="stat.icon" />
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <n-progress
              v-if="stat.progress"
              type="line"
              :percentage="stat.progress.percentage"
              :color="stat.progress.color"
              :height="4"
              :show-indicator="false"
            />
            <div class="stat-trend" v-if="stat.trend">
              <n-tag :type="stat.trend.type">{{ stat.trend.text }}</n-tag>
            </div>
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 中部内容展示区域 -->
    <div class="mt-16"></div>
    <n-grid cols="1 m:2" :x-gap="16" :y-gap="16" class="mt-16">
      <n-grid-item>
        <n-card title="最近文章" class="content-card">
          <n-list hoverable clickable>
            <n-list-item v-for="(item, index) in recentArticles" :key="index">
              <n-thing :title="item.title">
                <template #avatar>
                  <n-avatar round :size="40" :src="item.image" />
                </template>
                <template #header-extra>
                  <n-tag :type="getTagType(index)">{{ item.category }}</n-tag>
                </template>
                <template #description>
                  <div class="flex-between">
                    <n-space>
                      <n-icon :component="personOutlineIcon" />
                      <n-text>{{ item.author }}</n-text>
                    </n-space>
                    <n-space>
                      <n-icon :component="timeOutlineIcon" />
                      <n-text>{{ item.publishTime }}</n-text>
                    </n-space>
                  </div>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          <div class="text-center mt-16">
            <n-button text>查看更多文章</n-button>
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="新增用户" class="content-card">
          <n-list>
            <n-list-item v-for="(user, index) in newUsers" :key="index">
              <n-thing :title="user.name">
                <template #avatar>
                  <n-avatar round :size="40" :src="user.avatar" />
                </template>
                <template #header-extra>
                  <n-tag :type="user.vip ? 'success' : 'default'">{{
                    user.vip ? 'VIP会员' : '普通会员'
                  }}</n-tag>
                </template>
                <template #description>
                  <div class="flex-between">
                    <n-text>{{ user.email }}</n-text>
                    <n-text>{{ user.registerTime }}</n-text>
                  </div>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          <div class="text-center mt-16">
            <n-button text>查看更多用户</n-button>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 快速链接区域 -->
    <n-card title="快速操作" class="mt-16">
      <n-space>
        <n-button type="primary" @click="goToCreateArticle">
          <template #icon>
            <n-icon :component="createOutlineIcon" />
          </template>
          发布文章
        </n-button>
        <n-button type="info" @click="goToUserManage">
          <template #icon>
            <n-icon :component="personAddOutlineIcon" />
          </template>
          添加用户
        </n-button>
        <n-button type="success" @click="goToCommentManage">
          <template #icon>
            <n-icon :component="chatbubblesOutlineIcon" />
          </template>
          审核评论
        </n-button>
        <n-button type="warning" @click="goToSystemSetting">
          <template #icon>
            <n-icon :component="settingsOutlineIcon" />
          </template>
          系统设置
        </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import {
  PeopleOutline,
  PersonOutline,
  DocumentTextOutline,
  ChatbubblesOutline,
  TimeOutline,
  SettingsOutline,
  PersonAddOutline,
  CreateOutline,
  StatsChartOutline,
} from '@vicons/ionicons5'
import { formatDate } from '../../utils/date/index'

// 使用markRaw处理图标组件，避免被设为响应式对象
const peopleOutlineIcon = markRaw(PeopleOutline)
const personOutlineIcon = markRaw(PersonOutline)
const documentTextOutlineIcon = markRaw(DocumentTextOutline)
const chatbubblesOutlineIcon = markRaw(ChatbubblesOutline)
const timeOutlineIcon = markRaw(TimeOutline)
const settingsOutlineIcon = markRaw(SettingsOutline)
const personAddOutlineIcon = markRaw(PersonAddOutline)
const createOutlineIcon = markRaw(CreateOutline)
const statsChartOutlineIcon = markRaw(StatsChartOutline)

const router = useRouter()

// 当前日期
const currentDate = computed(() => formatDate(new Date(), 'YYYY年MM月DD日'))

// 顶部统计卡片数据
const topStats = ref([
  {
    title: '用户总数',
    value: '5,842',
    icon: peopleOutlineIcon,
    progress: { percentage: 70, color: '#18a058' },
    trend: { type: 'success', text: '月增长 12%' },
  },
  {
    title: '文章总数',
    value: '756',
    icon: documentTextOutlineIcon,
    progress: { percentage: 45, color: '#2080f0' },
    trend: { type: 'success', text: '月增长 8%' },
  },
  {
    title: '评论总数',
    value: '2,483',
    icon: chatbubblesOutlineIcon,
    progress: { percentage: 60, color: '#f0a020' },
  },
  {
    title: '系统健康度',
    value: '98%',
    icon: statsChartOutlineIcon,
    progress: { percentage: 98, color: '#18a058' },
  },
])

// 最近文章数据
const recentArticles = ref([
  {
    title: '健身初学者必读：科学健身指南',
    author: '李教练',
    publishTime: '2025-03-28',
    category: '健身指导',
    image: 'https://placeholder.pics/svg/40',
  },
  {
    title: '营养补充剂：真相与误区',
    author: '王营养师',
    publishTime: '2025-03-25',
    category: '饮食营养',
    image: 'https://placeholder.pics/svg/40',
  },
  {
    title: '居家训练：无器械高效锻炼方案',
    author: '张教练',
    publishTime: '2025-03-23',
    category: '居家健身',
    image: 'https://placeholder.pics/svg/40',
  },
])

// 新增用户数据
const newUsers = ref([
  {
    name: '张三',
    email: 'zhangsan@example.com',
    registerTime: '2025-03-29',
    vip: true,
    avatar: 'https://placeholder.pics/svg/40',
  },
  {
    name: '李四',
    email: 'lisi@example.com',
    registerTime: '2025-03-28',
    vip: false,
    avatar: 'https://placeholder.pics/svg/40',
  },
  {
    name: '王五',
    email: 'wangwu@example.com',
    registerTime: '2025-03-28',
    vip: true,
    avatar: 'https://placeholder.pics/svg/40',
  },
])

// 标签类型函数
const getTagType = (index: number) => {
  const types = ['success', 'info', 'warning', 'error']
  return types[index % types.length]
}

// 页面跳转函数
const goToCreateArticle = () => {
  router.push('/blogs/create')
}

const goToUserManage = () => {
  router.push('/users/add')
}

const goToCommentManage = () => {
  router.push('/comments')
}

const goToSystemSetting = () => {
  router.push('/settings')
}
</script>

<style scoped>
.dashboard-container {
  padding: 16px;
}

.welcome-header {
  margin-bottom: 16px;
}

.welcome-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.welcome-subtitle {
  margin: 4px 0 0 0;
  color: #909399;
}

.stat-card {
  height: 100%;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-title {
  font-size: 14px;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.content-card {
  height: 100%;
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

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
