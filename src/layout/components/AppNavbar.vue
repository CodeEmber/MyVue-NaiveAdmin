<template>
  <n-breadcrumb class="header-nav" :class="{ 'dark-mode': isDarkMode }">
    <n-button text @click="refreshout" class="center icon">
      <div class="icon-wrapper">
        <n-icon size="18">
          <ReloadOutline />
        </n-icon>
      </div>
    </n-button>
    <div class="center header-nav-item">
      <template v-for="routeItem in breadcrumbList" :key="routeItem.key">
        <n-breadcrumb-item>
          <n-dropdown
            v-if="(routeItem.children ?? []).length"
            :options="routeItem.children"
            @select="dropdownSelect"
          >
            <span class="link-text" style="font-weight: 500">
              {{ routeItem.label }}
            </span>
          </n-dropdown>
          <span class="link-text" v-else>
            {{ routeItem.label }}
          </span>
        </n-breadcrumb-item>
      </template>
    </div>

    <div class="center theme-controls">
      <!-- 主题切换按钮 -->
      <n-button text @click="toggleTheme" class="theme-btn">
        <div class="icon-wrapper">
          <n-icon size="18">
            <SunnyOutline v-if="isDarkMode" />
            <MoonOutline v-else />
          </n-icon>
        </div>
      </n-button>

      <!-- 全屏切换按钮 -->
      <n-button text @click="toggleFullscreen" class="fullscreen-btn">
        <div class="icon-wrapper">
          <n-icon size="18">
            <ContractOutline v-if="isFullscreen" />
            <ExpandOutline v-else />
          </n-icon>
        </div>
      </n-button>

      <!-- 语言切换按钮 -->
      <n-dropdown
        trigger="click"
        :options="languageOptions"
        @select="handleLanguageSelect"
        :value="languageStore.currentLanguage"
      >
        <n-button text class="language-btn">
          <div class="icon-wrapper">
            <n-icon size="18">
              <LanguageOutline />
            </n-icon>
          </div>
        </n-button>
      </n-dropdown>

      <!-- 页面配置按钮 -->
      <n-button text @click="openSettingsDrawer" class="settings-btn">
        <div class="icon-wrapper">
          <n-icon size="18">
            <SettingsOutline />
          </n-icon>
        </div>
      </n-button>
    </div>

    <!-- 头像大小调整 -->
    <n-dropdown :options="options" @select="handleSelect">
      <n-avatar
        round
        size="small"
        src="https://wyx-shanghai.oss-cn-shanghai.aliyuncs.com/img/header.jpeg"
        class="center img"
      />
    </n-dropdown>

    <!-- 页面配置抽屉 -->
    <n-drawer v-model:show="showSettingsDrawer" :width="300" placement="right">
      <n-drawer-content :title="t('navbar.settings')">
        <n-divider>{{ t('navbar.theme.title') }}</n-divider>
        <n-space vertical>
          <n-space align="center" justify="space-between">
            <span>{{ t('navbar.theme.darkMode') }}</span>
            <n-switch v-model:value="isDarkMode" @update:value="toggleTheme" />
          </n-space>

          <n-space vertical size="small">
            <span>{{ t('navbar.theme.themeColor') }}</span>
            <n-color-picker
              v-model:value="primaryColor"
              :swatches="colorSwatches"
              @update:value="updatePrimaryColor"
            />
          </n-space>
        </n-space>
      </n-drawer-content>
    </n-drawer>

    <n-modal v-model:show="profile" closable>
      <n-card style="width: 600px" :title="t('navbar.profile')" :bordered="false" size="huge">
        <h6>123</h6>
      </n-card>
    </n-modal>
    <n-modal
      v-model:show="editProfile"
      closable
      preset="dialog"
      :positive-text="t('common.confirm')"
      :negative-text="t('common.cancel.text')"
      @positive-click="submitCallback"
      @negative-click="cancelCallback"
    >
      <template #header>
        <div>{{ t('navbar.editProfile') }}</div>
      </template>
      <div>
        <n-form :model="model" ref="formRef" :rules="rules" size="large" label-placement="left">
          <n-form-item path="account" label-style="{background:red}" :label="t('profile.age')">
            <n-input
              v-model:value="model.account"
              clearable
              @keydown.enter.prevent
              :placeholder="t('profile.enterUsername')"
            />
          </n-form-item>
          <n-form-item path="password" :label="t('login.password')">
            <n-input v-model:value="model.password" type="password" :placeholder="t('profile.enterPassword')" />
          </n-form-item>
        </n-form>
      </div>
    </n-modal>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { h, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon, useMessage, type FormInst, type FormRules } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import i18n from '../../i18n'
import type { Component } from 'vue'
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
  MoonOutline,
  SunnyOutline,
  SettingsOutline,
  ReloadOutline,
  ExpandOutline,
  ContractOutline,
  LanguageOutline,
} from '@vicons/ionicons5'
import { useAppStore } from '../../stores/app'
import { useUserStore } from '../../stores/user'
import { useLanguageStore } from '../../stores/language'
import type { RouteRecordNormalized } from 'vue-router'

// 设置组件名称
defineOptions({
  name: 'AppNavbar',
})

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const router = useRouter()
const route = useRoute()
const message = useMessage()
const appStore = useAppStore()
const userStore = useUserStore() // 使用用户状态
const languageStore = useLanguageStore() // 使用语言状态
const { t } = useI18n() // 使用翻译函数
const profile = ref(false)
const editProfile = ref(false)
const formRef = ref<FormInst | null>(null)
const modelRef = ref({
  account: null as string | null,
  password: null as string | null,
})

// 设置抽屉状态
const showSettingsDrawer = ref(false)

// 添加主题相关计算属性和方法
const isDarkMode = computed(() => appStore.isDarkMode)
const primaryColor = computed({
  get: () => appStore.primaryColor,
  set: (value) => appStore.setPrimaryColor(value),
})

const colorSwatches = [
  '#18a058', // 默认绿色
  '#2080f0', // 蓝色
  '#f0a020', // 黄色
  '#d03050', // 红色
  '#8a2be2', // 紫色
  '#ff6347', // 珊瑚色
]

const toggleTheme = () => {
  appStore.toggleThemeMode()
  message.success(isDarkMode.value ? t('navbar.theme.toggleDark') : t('navbar.theme.toggleLight'))
}

const updatePrimaryColor = (color: string) => {
  appStore.setPrimaryColor(color)
  message.success(t('navbar.theme.themeSuccess'))
}

const openSettingsDrawer = () => {
  showSettingsDrawer.value = true
}

// 创建类型安全的面包屑项类型
interface BreadcrumbItem {
  key: string
  label: string
  disabled?: boolean
  children?: BreadcrumbItem[]
}

// 使用明确的返回类型，避免类型推断问题
const generator = (routerMap: RouteRecordNormalized[]): BreadcrumbItem[] => {
  return routerMap.map((item) => {
    // 确保 key 是字符串类型
    const nameAsString = typeof item.name === 'symbol' ? item.name.toString() : String(item.name)

    // 确保 label 是字符串类型，并进行翻译处理
    let labelText: string = nameAsString
    if (item.meta && typeof item.meta === 'object' && 'title' in item.meta) {
      // 如果 meta.title 是一个翻译键，使用 t 函数进行翻译
      const title = String(item.meta.title)
      labelText = t(title)
    }

    // 创建一个符合自定义 BreadcrumbItem 类型的对象
    const currentMenu: BreadcrumbItem = {
      label: labelText,
      key: nameAsString,
      disabled: item.path === '/',
    }

    // 处理子路由
    if (item.children && item.children.length > 0) {
      const filteredChildren = item.children.filter((child) => {
        // 安全地检查 meta.hideBreadcrumb
        return !(
          child.meta &&
          typeof child.meta === 'object' &&
          'hideBreadcrumb' in child.meta &&
          child.meta.hideBreadcrumb
        )
      }) as RouteRecordNormalized[]

      if (filteredChildren.length > 0) {
        currentMenu.children = generator(filteredChildren)
      }
    }

    return currentMenu
  })
}

const breadcrumbList = computed(() => {
  return generator(route.matched)
})

const dropdownSelect = (key: string) => {
  router.push({ name: key })
}

function refreshout() {
  location.reload()
}

function handleSelect(key: string) {
  if (key === 'profile') {
    profile.value = true
  } else if (key === 'editProfile') {
    editProfile.value = true
  } else if (key === 'logout') {
    // 使用用户状态中的退出登录方法
    userStore.logout().then(() => {
      message.success(t('navbar.logoutSuccess'))
      router.push('/login')
    })
  }
}

function cancelCallback() {
  message.success(t('common.cancel.success'))
}

function submitCallback() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success(t('common.validate.success'))
      editProfile.value = false
    } else {
      message.error(t('common.validate.failed'))
    }
  })
  return false
}

const rules: FormRules = {
  account: [
    {
      required: true,
      message: t('form.account.required'),
    },
  ],
  password: [
    {
      required: true,
      message: t('form.password.required'),
    },
  ],
}

// 用户选项
const options = computed(() => [
  {
    label: t('navbar.profile'),
    key: 'profile',
    icon: renderIcon(UserIcon),
  },
  {
    label: t('navbar.editProfile'),
    key: 'editProfile',
    icon: renderIcon(EditIcon),
  },
  {
    label: t('navbar.logout'),
    key: 'logout',
    icon: renderIcon(LogoutIcon),
  },
])

// 编程式导出 model，供模板使用
const model = modelRef

// 添加全屏相关状态
const isFullscreen = ref(false)

// 添加语言选项
const languageOptions = computed(() =>
  languageStore.availableLanguages.map((lang) => ({
    label: lang.label,
    key: lang.value,
  })),
)

// 处理语言选择
const handleLanguageSelect = (key: string) => {
  // 直接在组件中设置i18n的locale，使用类型断言
  i18n.global.locale.value = key as 'zh-CN' | 'en-US'

  // 更新store中的当前语言
  languageStore.currentLanguage = key
  localStorage.setItem('language', key)

  // 导入并调用更新页面标题函数
  import('@/router').then(({ updatePageTitle }) => {
    updatePageTitle()
  })

  // 强制重新渲染面包屑导航，解决菜单消失问题
  router.replace(router.currentRoute.value.fullPath)

  // 显示切换成功消息
  message.success(`${t('navbar.language')}: ${key === 'zh-CN' ? t('language.zhCN') : t('language.enUS')}`)
}

// 添加全屏切换功能
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    // 进入全屏模式
    document.documentElement
      .requestFullscreen()
      .then(() => {
        isFullscreen.value = true
        message.success(t('navbar.fullscreen.enter'))
      })
      .catch((err) => {
        message.error(`${t('navbar.fullscreen.failed')}: ${err.message}`)
      })
  } else {
    // 退出全屏模式
    if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          isFullscreen.value = false
          message.success(t('navbar.fullscreen.exit'))
        })
        .catch((err) => {
          message.error(`${t('navbar.fullscreen.failed')}: ${err.message}`)
        })
    }
  }
}

// 监听全屏状态变化
const setupFullscreenListener = () => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
}

// 组件挂载时设置监听器
setupFullscreenListener()
</script>

<style scoped>
.header-nav {
  background-color: white;
  height: 60px;
  width: 100%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  -webkit-transform: translate3d(0, 0px, -2px);
  transform: translate3d(0, 1px, -2px);
  transition:
    background-color 0.3s,
    color 0.3s;
  position: relative;
}

.dark-mode {
  background-color: #242529;
  color: #e5e5e5;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.icon {
  left: 20px;
}
.header-nav-item {
  left: 60px;
}

/* 调整控制按钮组的位置，考虑新增的全屏按钮 */
.theme-controls {
  display: flex;
  gap: 10px;
  right: 100px;
}

.img {
  right: 50px;
}
.link-text {
  font-size: 14px;
}
.icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
