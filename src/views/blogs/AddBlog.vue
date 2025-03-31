<template>
  <div>
    <n-card>
      <template #header>
        <n-space align="stretch">
          <n-icon size="22" style="margin-top: 2px"><CreateOutline /></n-icon>
          添加博客
        </n-space>
      </template>
      <template #header-extra>
        <n-button type="default" size="small" @click="goBack">
          <template #icon>
            <n-icon>
              <ArrowBackOutline />
            </n-icon>
          </template>
          返回列表
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
        <n-form-item label="博客分类" path="blogCategory">
          <n-select
            placeholder="请选择博客分类"
            :options="categoryOptions"
            v-model:value="model.blogCategory"
            clearable
          />
        </n-form-item>
        <n-form-item label="博客标题" path="blogTitle">
          <n-input placeholder="请输入博客标题" v-model:value="model.blogTitle" clearable />
        </n-form-item>
        <n-form-item label="博客摘要" path="blogSummary">
          <n-input
            placeholder="请输入博客摘要"
            v-model:value="model.blogSummary"
            type="textarea"
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
          />
        </n-form-item>
        <n-form-item label="博客作者" path="blogAuthor">
          <n-input placeholder="请输入博客作者" v-model:value="model.blogAuthor" clearable />
        </n-form-item>
        <n-form-item label="封面图片" path="blogCover">
          <n-input placeholder="请输入封面图片链接" v-model:value="model.blogCover" clearable />
        </n-form-item>
        <n-form-item label="发布时间" path="publishDate">
          <!-- 不允许选未来的时间 -->
          <n-date-picker
            v-model:formatted-value="model.publishDate"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            :is-date-disabled="dateDisabled"
          />
        </n-form-item>
        <n-form-item label="博客状态" path="blogStatus">
          <n-radio-group v-model:value="model.blogStatus">
            <n-space>
              <n-radio value="published"> 已发布 </n-radio>
              <n-radio value="draft"> 草稿 </n-radio>
              <n-radio value="review"> 审核中 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="博客内容" path="blogContent">
          <n-input
            placeholder="请输入博客内容"
            v-model:value="model.blogContent"
            type="textarea"
            :autosize="{
              minRows: 6,
              maxRows: 12,
            }"
          />
        </n-form-item>
        <div style="display: flex; justify-content: flex-end">
          <n-button @click="resetButtonClick" type="primary" ghost style="margin-right: 12px"
            >重置</n-button
          >
          <n-button @click="addButtonClick" type="primary">添加</n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { CreateOutline, ArrowBackOutline } from '@vicons/ionicons5'

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

const rules = {
  blogCategory: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择博客分类',
  },
  blogTitle: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入博客标题',
  },
  blogSummary: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入博客摘要',
  },
  blogAuthor: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入博客作者',
  },
  blogCover: {
    trigger: ['blur', 'input'],
  },
  publishDate: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择发布时间',
  },
  blogStatus: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择博客状态',
  },
  blogContent: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入博客内容',
  },
}

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
      message.success('博客添加成功')
      setTimeout(() => {
        goBack()
      }, 1500)
    } else {
      message.error('表单填写有误，请检查')
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

<style></style>
