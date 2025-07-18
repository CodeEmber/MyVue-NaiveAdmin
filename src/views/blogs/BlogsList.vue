<template>
  <div class="blogs-list">
    <!-- 搜索区域卡片 -->
    <n-card style="margin-bottom: 16px">
      <template #header>
        <div style="display: flex; align-items: center">
          <span>{{ t('blogs.search') }}</span>
        </div>
      </template>
      <template #header-extra>
        <n-space>
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <n-icon>
                <SearchOutline />
              </n-icon>
            </template>
            {{ t('common.search') }}
          </n-button>
          <n-button @click="clearSearch">{{ t('common.reset') }}</n-button>
        </n-space>
      </template>
      <n-space vertical>
        <n-form inline>
          <n-form-item :label="t('blogs.blogTitle')">
            <n-input
              v-model:value="searchValue"
              :placeholder="t('blogs.titlePlaceholder')"
              clearable
            >
              <template #prefix>
                <n-icon>
                  <SearchOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item :label="t('blogs.blogCategory')">
            <n-select
              v-model:value="searchCategory"
              :placeholder="t('blogs.selectCategory')"
              clearable
              :options="categoryOptions"
              style="width: 180px"
            />
          </n-form-item>
          <n-form-item :label="t('blogs.blogStatus')">
            <n-select
              v-model:value="searchStatus"
              :placeholder="t('blogs.selectStatus')"
              clearable
              :options="statusOptions"
              style="width: 180px"
            />
          </n-form-item>
        </n-form>
      </n-space>
    </n-card>

    <!-- 博客列表卡片 -->
    <n-card>
      <template #header
        ><n-space align="stretch">{{ t('blogs.list') }}</n-space></template
      >
      <template #header-extra
        ><n-button type="primary" size="small" @click="addBlog"
          ><template #icon>
            <n-icon>
              <AddCircleOutline />
            </n-icon> </template
          >{{ t('blogs.add') }}</n-button
        >
      </template>
      <n-data-table
        ref="table"
        size="small"
        :columns="columnsRef"
        :data="displayData"
        :pagination="paginationReactive"
        @update:sorter="handleSorterChange"
        :loading="loading"
      />
    </n-card>

    <!-- 博客编辑模态框 -->
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      @negative-click="cancelCallback"
      @positive-click="submitCallback"
      style="width: 600px"
      :negative-text="t('common.cancel.text')"
      :positive-text="t('common.confirm')"
      @mask-click="cancelCallback"
      ><template #header>{{ blogContent.is_edit ? t('blogs.edit') : t('blogs.add') }}</template>
      <div>
        <n-form
          :model="blogContent"
          label-placement="left"
          size="medium"
          :style="{
            maxWidth: '640px',
            margin: '40px 0px 10px 0px',
          }"
        >
          <n-form-item :label="t('blogs.blogTitle')">
            <n-input
              :placeholder="t('blogs.enterTitle')"
              v-model:value="blogContent.title"
              clearable
            />
          </n-form-item>
          <n-form-item :label="t('blogs.blogSummary')">
            <n-input
              type="textarea"
              :placeholder="t('blogs.enterSummary')"
              v-model:value="blogContent.summary"
              clearable
            />
          </n-form-item>
          <n-form-item :label="t('blogs.blogStatus')">
            <n-select v-model:value="blogContent.status" :options="statusOptionsComputed" />
          </n-form-item>
          <n-form-item :label="t('blogs.blogCategory')">
            <n-select v-model:value="blogContent.category" :options="categoryOptions" />
          </n-form-item>
        </n-form></div
    ></n-modal>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref, onMounted, computed } from 'vue'
import { AddCircleOutline, SearchOutline } from '@vicons/ionicons5'
import { NTag, NButton, useMessage, NPopconfirm } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

// 初始化i18n
const { t } = useI18n()

// 添加路由
const router = useRouter()

// 模拟数据
const mockBlogsData = [
  {
    id: 1,
    title: '健身入门指南',
    author: '张教练',
    category: '入门指导',
    status: 'published',
    views: 1280,
    comments: 32,
    publishDate: '2025-03-15',
  },
  {
    id: 2,
    title: '力量训练完全手册',
    author: '李教练',
    category: '专业训练',
    status: 'published',
    views: 950,
    comments: 25,
    publishDate: '2025-03-10',
  },
  {
    id: 3,
    title: '营养搭配与健身效果',
    author: '王营养师',
    category: '饮食营养',
    status: 'draft',
    views: 0,
    comments: 0,
    publishDate: '-',
  },
  {
    id: 4,
    title: '有氧运动与脂肪燃烧',
    author: '刘教练',
    category: '有氧训练',
    status: 'published',
    views: 1520,
    comments: 45,
    publishDate: '2025-02-28',
  },
  {
    id: 5,
    title: '健身器材使用指南',
    author: '林教练',
    category: '器材使用',
    status: 'review',
    views: 0,
    comments: 0,
    publishDate: '-',
  },
]

const loading = ref(false)
const blogsData = ref<
  {
    id: number
    title: string
    author: string
    category: string
    status: string
    views: number
    comments: number
    publishDate: string
  }[]
>([])
const filteredData = ref<
  {
    id: number
    title: string
    author: string
    category: string
    status: string
    views: number
    comments: number
    publishDate: string
  }[]
>([]) // 添加过滤后的数据变量
const message = useMessage()
const showModal = ref(false)

// 搜索相关变量
const searchValue = ref('')
const searchCategory = ref(null)
const searchStatus = ref(null)

// 博客状态
const statusOptionsComputed = computed(() => [
  {
    label: t('blogs.status.published'),
    value: 'published',
  },
  {
    label: t('blogs.status.draft'),
    value: 'draft',
  },
  {
    label: t('blogs.status.review'),
    value: 'review',
  },
])

// 保留静态版本用于表格筛选
const statusOptions = [
  {
    label: t('blogs.status.published'),
    value: 'published',
  },
  {
    label: t('blogs.status.draft'),
    value: 'draft',
  },
  {
    label: t('blogs.status.review'),
    value: 'review',
  },
]

const categoryOptions = [
  {
    label: t('blogs.categories.beginner'),
    value: 'beginner',
  },
  {
    label: t('blogs.categories.professional'),
    value: 'professional',
  },
  {
    label: t('blogs.categories.nutrition'),
    value: 'nutrition',
  },
  {
    label: t('blogs.categories.aerobic'),
    value: 'aerobic',
  },
  {
    label: t('blogs.categories.equipment'),
    value: 'equipment',
  },
]

const columns = ({
  edit,
}: {
  edit: (row: { title: string | null; status: string; category: string; id: number | null }) => void
}) => [
  {
    title: 'ID',
    key: 'id',
    align: 'center',
    sorter: 'default',
    sortOrder: false,
  },
  {
    title: t('blogs.blogTitle'),
    key: 'title',
    align: 'center',
  },
  {
    title: t('blogs.blogAuthor'),
    key: 'author',
    align: 'center',
  },
  {
    title: t('blogs.blogCategory'),
    key: 'category',
    align: 'center',
    // 筛选配置，使用国际化标签
    filterOptions: categoryOptions.map((option) => ({
      label: option.label,
      value: option.value,
    })),
    filter(value: string, row: { category: string }) {
      return row.category === value
    },
  },
  {
    title: t('blogs.blogStatus'),
    key: 'status',
    align: 'center',
    render(row: { status: string }) {
      if (row.status === 'published') {
        return h(
          NTag,
          {
            size: 'small',
            type: 'success',
          },
          { default: () => t('blogs.status.published') },
        )
      } else if (row.status === 'draft') {
        return h(
          NTag,
          {
            size: 'small',
            type: 'warning',
          },
          { default: () => t('blogs.status.draft') },
        )
      } else if (row.status === 'review') {
        return h(
          NTag,
          {
            size: 'small',
            type: 'info',
          },
          { default: () => t('blogs.status.review') },
        )
      }
    },
    filterOptions: [
      {
        label: t('blogs.status.published'),
        value: 'published',
      },
      {
        label: t('blogs.status.draft'),
        value: 'draft',
      },
      {
        label: t('blogs.status.review'),
        value: 'review',
      },
    ],

    filter(value: string, row: { status: string }) {
      return row.status === value
    },
  },
  {
    title: t('blogs.views'),
    key: 'views',
    align: 'center',
    sorter: 'default',
    sortOrder: false,
  },
  {
    title: t('blogs.comments'),
    key: 'comments',
    align: 'center',
    sorter: 'default',
    sortOrder: false,
  },
  {
    title: t('blogs.publishDate'),
    key: 'publishDate',
    align: 'center',
  },
  {
    title: t('blogs.operations'),
    key: 'operation',
    align: 'center',
    width: 200,
    render(row: { title: string | null; status: string; category: string; id: number | null }) {
      return [
        h(
          NButton,
          {
            size: 'small',
            style: {
              marginRight: '8px',
            },
            onClick: () => edit(row),
          },
          { default: () => t('common.edit') },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => {
              deleteBlog(row)
            },
            positiveText: t('common.confirm'),
            negativeText: t('common.cancel.text'),
          },
          {
            trigger: () => {
              return h(
                NButton,
                {
                  size: 'small',
                },
                { default: () => t('common.delete') },
              )
            },
            default: () => t('blogs.confirmDelete'),
          },
        ),
      ]
    },
  },
]

// 将columnsRef改为计算属性，以便在语言变化时自动更新
const columnsRef = computed(() =>
  columns({
    edit,
  }),
)

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  pageSlot: 6,
  showSizePicker: true,
  showQuickJumper: true,
  pageSizes: [10, 15, 20, 25],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onPageSizeChange: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})

const blogContent = ref<{
  is_edit: boolean
  title: string | null
  summary: string | null
  status: string
  category: string
  id: number | null
}>({
  is_edit: false,
  title: null,
  summary: null,
  status: 'published',
  category: 'beginner', // 使用语言无关的值
  id: null,
})

// 更新计算属性：展示数据改为直接使用过滤后的数据
const displayData = computed(() => {
  return filteredData.value
})

// 模拟获取博客列表数据
function getAllBlogs() {
  loading.value = true

  // 模拟API请求延迟
  setTimeout(() => {
    blogsData.value = [...mockBlogsData]
    filteredData.value = [...mockBlogsData] // 初始化过滤后的数据
    loading.value = false
  }, 500)
}

function addBlog() {
  router.push('/blogs/add')
}

function edit(row: { title: string | null; status: string; category: string; id: number | null }) {
  showModal.value = true
  if (row) {
    blogContent.value.title = row.title
    blogContent.value.summary = '这是' + row.title + '的内容摘要...' // 模拟数据
    blogContent.value.status = row.status
    blogContent.value.category = row.category
    blogContent.value.is_edit = true
    blogContent.value.id = row.id
  } else {
    blogContent.value.title = null
    blogContent.value.summary = null
    blogContent.value.status = 'published'
    blogContent.value.category = 'beginner' // 使用语言无关的值
    blogContent.value.is_edit = false
    blogContent.value.id = null
  }
}

// 由于 Naive UI 的表格组件会自动处理排序，所以这里不再需要额外的排序处理逻辑
function handleSorterChange() {
  // 仅用于触发数据重新渲染
  console.log('排序已更改')
}

function cancelCallback() {
  showModal.value = false
  blogContent.value.title = null
  blogContent.value.summary = null
  blogContent.value.status = 'published'
  blogContent.value.category = 'beginner' // 使用语言无关的值
  blogContent.value.is_edit = false
  blogContent.value.id = null
}

function submitCallback() {
  if (!blogContent.value.title || !blogContent.value.summary) {
    message.error(t('blogs.error.incompleteContent'))
    return false
  } else {
    if (blogContent.value.is_edit) {
      // 模拟更新博客
      const index = blogsData.value.findIndex((blog) => blog.id === blogContent.value.id)
      if (index !== -1) {
        blogsData.value[index].title = blogContent.value.title
        blogsData.value[index].category = blogContent.value.category
        blogsData.value[index].status = blogContent.value.status
        message.success(t('blogs.success.update'))
        showModal.value = false
      } else {
        message.error(t('blogs.error.updateFailed'))
      }
    } else {
      // 模拟添加博客
      const newId = Math.max(...blogsData.value.map((blog) => blog.id)) + 1
      blogsData.value.push({
        id: newId,
        title: blogContent.value.title,
        author: t('blogs.currentUser'), // 假设是当前登录用户
        category: blogContent.value.category,
        status: blogContent.value.status,
        views: 0,
        comments: 0,
        publishDate:
          blogContent.value.status === 'published' ? new Date().toISOString().slice(0, 10) : '-',
      })
      message.success(t('blogs.success.add'))
      showModal.value = false
    }
  }
  return false
}

function deleteBlog(row: { status?: string; id?: unknown }) {
  // 修改删除逻辑，同步更新过滤后的数据
  const index = blogsData.value.findIndex((blog) => blog.id === row.id)
  if (index !== -1) {
    blogsData.value.splice(index, 1)
    // 同步更新过滤后的数据
    const filteredIndex = filteredData.value.findIndex((blog) => blog.id === row.id)
    if (filteredIndex !== -1) {
      filteredData.value.splice(filteredIndex, 1)
    }
    message.success(t('blogs.success.delete'))
  } else {
    message.error(t('blogs.error.deleteFailed'))
  }
}

// 处理搜索 - 点击搜索按钮时执行
function handleSearch() {
  // 应用筛选条件
  filteredData.value = blogsData.value.filter((blog) => {
    let matchesTitle = true
    let matchesCategory = true
    let matchesStatus = true

    // 按标题筛选
    if (searchValue.value) {
      matchesTitle = blog.title.toLowerCase().includes(searchValue.value.toLowerCase())
    }

    // 按分类筛选
    if (searchCategory.value) {
      matchesCategory = blog.category === searchCategory.value
    }

    // 按状态筛选
    if (searchStatus.value) {
      matchesStatus = blog.status === searchStatus.value
    }

    return matchesTitle && matchesCategory && matchesStatus
  })

  // 重置分页到第一页
  paginationReactive.page = 1
}

// 清除搜索
function clearSearch() {
  searchValue.value = ''
  searchCategory.value = null
  searchStatus.value = null
  filteredData.value = [...blogsData.value] // 清除过滤，显示所有数据
  paginationReactive.page = 1
}

onMounted(() => {
  getAllBlogs()
})
</script>

<style scoped>
.blogs-list {
  padding: 16px;
}
</style>
