<template>
  <div class="add-blog">
    <n-card>
      <template #header>
        <n-space align="stretch">
          <n-icon size="22" style="margin-top: 2px"><CreateOutline /></n-icon>
          {{ t('blogs.add') }}
        </n-space>
      </template>
      <template #header-extra>
        <n-button type="default" size="small" @click="goBack">
          <template #icon>
            <n-icon>
              <ArrowBackOutline />
            </n-icon>
          </template>
          {{ t('blogs.backToList') }}
        </n-button>
      </template>
      <n-form
        :model="model"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="160"
        size="medium"
        :style="{
          maxWidth: '640px',
          margin: '20px auto',
        }"
      >
        <n-form-item :label="t('blogs.blogCategory')" path="blogCategory">
          <n-select
            :placeholder="t('blogs.selectCategory')"
            :options="categoryOptions"
            v-model:value="model.blogCategory"
            clearable
          />
        </n-form-item>
        <n-form-item :label="t('blogs.blogTitle')" path="blogTitle">
          <n-input :placeholder="t('blogs.enterTitle')" v-model:value="model.blogTitle" clearable />
        </n-form-item>
        <n-form-item :label="t('blogs.blogSummary')" path="blogSummary">
          <n-input
            :placeholder="t('blogs.enterSummary')"
            v-model:value="model.blogSummary"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
          />
        </n-form-item>
        <n-form-item :label="t('blogs.blogAuthor')" path="blogAuthor">
          <n-input
            :placeholder="t('blogs.enterAuthor')"
            v-model:value="model.blogAuthor"
            clearable
          />
        </n-form-item>
        <n-form-item :label="t('blogs.blogCover')" path="blogCover">
          <n-input
            :placeholder="t('blogs.enterCoverUrl')"
            v-model:value="model.blogCover"
            clearable
          />
        </n-form-item>
        <n-form-item :label="t('blogs.publishDate')" path="publishDate">
          <!-- 不允许选未来的时间 -->
          <n-date-picker
            v-model:formatted-value="model.publishDate"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            :is-date-disabled="dateDisabled"
          />
        </n-form-item>
        <n-form-item :label="t('blogs.blogStatus')" path="blogStatus">
          <n-radio-group v-model:value="model.blogStatus">
            <n-space>
              <n-radio value="published"> {{ t('blogs.status.published') }} </n-radio>
              <n-radio value="draft"> {{ t('blogs.status.draft') }} </n-radio>
              <n-radio value="review"> {{ t('blogs.status.review') }} </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item :label="t('blogs.blogContent')" path="blogContent">
          <n-input
            :placeholder="t('blogs.enterContent')"
            v-model:value="model.blogContent"
            type="textarea"
            :autosize="{
              minRows: 6,
              maxRows: 12,
            }"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button @click="resetButtonClick" type="primary" ghost style="margin-right: 12px">{{
            t('common.reset')
          }}</n-button>
          <n-button @click="addButtonClick" type="primary">{{ t('common.add') }}</n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { CreateOutline, ArrowBackOutline } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'

// 初始化i18n
const { t } = useI18n()

function dateDisabled(ts: number) {
  return ts > Date.now()
}

const router = useRouter()
import type { FormInst } from 'naive-ui'

const formRef = ref<FormInst | null>(null)
const message = useMessage()

// 分类选项
const categoryOptions = [
  {
    label: '入门指导',
    value: '入门指导',
  },
  {
    label: '专业训练',
    value: '专业训练',
  },
  {
    label: '饮食营养',
    value: '饮食营养',
  },
  {
    label: '有氧训练',
    value: '有氧训练',
  },
  {
    label: '器材使用',
    value: '器材使用',
  },
]

const rules = computed(() => ({
  blogCategory: {
    required: true,
    trigger: ['blur', 'change'],
    message: t('blogs.rules.categoryRequired'),
  },
  blogTitle: {
    required: true,
    trigger: ['blur', 'input'],
    message: t('blogs.rules.titleRequired'),
  },
  blogSummary: {
    required: true,
    trigger: ['blur', 'input'],
    message: t('blogs.rules.summaryRequired'),
  },
  blogAuthor: {
    required: true,
    trigger: ['blur', 'input'],
    message: t('blogs.rules.authorRequired'),
  },
  blogCover: {
    trigger: ['blur', 'input'],
  },
  publishDate: {
    required: true,
    trigger: ['blur', 'change'],
    message: t('blogs.rules.dateRequired'),
  },
  blogStatus: {
    required: true,
    trigger: ['blur', 'change'],
    message: t('blogs.rules.statusRequired'),
  },
  blogContent: {
    required: true,
    trigger: ['blur', 'input'],
    message: t('blogs.rules.contentRequired'),
  },
}))

const model = ref({
  blogCategory: null, // 博客分类
  blogTitle: null, // 博客标题
  blogAuthor: '健身教练', // 博客作者
  publishDate: new Date().toISOString().split('T')[0], // 发布日期
  blogSummary: null, // 博客摘要
  blogContent: null, // 博客内容
  blogStatus: 'published', // 博客状态
  blogCover: null, // 封面图片
})

function resetButtonClick() {
  model.value = {
    blogCategory: null,
    blogTitle: null,
    blogAuthor: '健身教练',
    publishDate: new Date().toISOString().split('T')[0],
    blogSummary: null,
    blogContent: null,
    blogStatus: 'published',
    blogCover: null,
  }
}

function addButtonClick(e: { preventDefault: () => void }) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      // 模拟添加博客
      message.success(t('blogs.addSuccess'))
      setTimeout(() => {
        goBack()
      }, 1500)
    } else {
      message.error(t('blogs.formError'))
    }
  })
}

function goBack() {
  router.push('/blogs/list')
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.add-blog {
  padding: 16px;
}
</style>
