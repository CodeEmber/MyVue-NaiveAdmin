<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>后台管理系统</h1>
      </div>

      <n-card class="login-form-card" :bordered="false">
        <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          class="login-form"
          size="large"
          :show-label="false"
        >
          <n-form-item path="username">
            <n-input
              v-model:value="formValue.username"
              placeholder="用户名"
              :input-props="{ autocomplete: 'username' }"
            >
              <template #prefix>
                <n-icon :component="personOutlineIcon" />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formValue.password"
              type="password"
              placeholder="密码"
              :input-props="{ autocomplete: 'current-password' }"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <n-icon :component="lockClosedOutlineIcon" />
              </template>
            </n-input>
          </n-form-item>

          <div class="login-options">
            <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
          </div>
          <div class="login-btn-wrapper">
            <n-button
              type="primary"
              block
              :loading="loading"
              :disabled="loading"
              @click="handleLogin"
            >
              {{ loading ? '登录中' : '登 录' }}
            </n-button>
          </div>

          <!-- 提示信息 -->
          <div class="login-tips">
            <p>演示账号：admin / 123456</p>
          </div>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInst, FormRules } from 'naive-ui'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import { useUserStore } from '../../stores/user'
import { useMessage } from 'naive-ui'

// 图标
const personOutlineIcon = markRaw(PersonOutline)
const lockClosedOutlineIcon = markRaw(LockClosedOutline)

// 表单相关
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  username: '',
  password: '',
})
const rememberMe = ref(false)
const loading = ref(false)
const message = useMessage()

// 表单校验规则
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: ['blur', 'input'] }],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'input'] },
    { min: 6, message: '密码长度不能小于6位', trigger: ['blur', 'input'] },
  ],
}

// 路由
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 加载记住的登录信息
onMounted(() => {
  // 检查是否有保存的登录状态
  const rememberedLogin = localStorage.getItem('rememberMe') === 'true'
  rememberMe.value = rememberedLogin

  // 如果选择了记住登录状态，则尝试加载用户名
  if (rememberedLogin) {
    const savedUsername = localStorage.getItem('rememberedUsername')
    if (savedUsername) {
      formValue.value.username = savedUsername
    }
  }
})

// 登录处理
const handleLogin = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    try {
      loading.value = true
      await userStore.login(formValue.value.username, formValue.value.password)

      message.success('登录成功')

      // 保存记住我的状态和用户名
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('rememberedUsername', formValue.value.username)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('rememberedUsername')
      }

      // 检查是否有重定向地址，有则跳转到重定向地址，否则跳转到首页
      const redirectPath = route.query.redirect as string
      if (redirectPath) {
        router.push(redirectPath)
      } else {
        router.push('/')
      }
    } catch (error: unknown) {
      console.error('登录失败:', error)
      if (error instanceof Error) {
        message.error(error.message || '登录失败，请检查用户名和密码')
      } else {
        message.error('登录失败，请检查用户名和密码')
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fa;
}
.login-box {
  width: 450px;
  padding: 20px;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.login-header h1 {
  font-size: 28px;
  margin-bottom: 5px;
  font-weight: 500;
}

.login-form-card {
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  overflow: hidden;
  padding: 20px 0px;
}

.login-form {
  padding: 10px 5px;
}

.login-options {
  margin-bottom: 14px;
}

.login-btn-wrapper {
  margin-top: 5px;
  margin-bottom: 10px;
}

.login-btn-wrapper .n-button {
  height: 42px;
  font-size: 16px;
  border-radius: 6px;
  font-weight: 500;
}

.login-tips {
  margin-top: 15px;
  text-align: center;
  font-size: 13px;
  color: #999;
}

.login-tips p {
  margin: 4px 0;
}

:deep(.n-form-item) {
  margin-bottom: 5px; /* 减少表单项之间的间距 */
}

:deep(.n-input) {
  --n-border-radius: 6px;
}

:deep(.n-input-wrapper) {
  padding-left: 12px;
}

:deep(.n-input__input-el) {
  height: 40px;
  font-size: 14px;
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #333 !important;
}

:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #333 !important;
  transition: background-color 5000s ease-in-out 0s;
}

:deep(.n-input__prefix) {
  margin-right: 10px;
  color: #999;
}

:deep(.n-input__prefix .n-icon) {
  font-size: 18px;
}
</style>
