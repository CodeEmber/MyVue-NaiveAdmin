export default {
  app: {
    title: '后台管理系统',
    description: '一个基于 Vue 3 和 Vite 的后台管理系统模板',
  },
  common: {
    confirm: '确认',
    cancel: '取消',
    search: '搜索',
    reset: '重置',
    back: '返回',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    loading: '加载中',
    success: '成功',
    failed: '失败',
  },
  login: {
    title: '后台管理系统',
    username: '用户名',
    password: '密码',
    rememberMe: '记住我',
    login: '登录',
    loginLoading: '登录中',
    loginSuccess: '登录成功',
    loginFailed: '登录失败，请检查用户名和密码',
    demoAccount: '演示账号：admin / 123456',
  },
  navbar: {
    profile: '个人资料',
    editProfile: '编辑资料',
    settings: '页面配置',
    logout: '退出登录',
    logoutSuccess: '已退出登录',
    refresh: '刷新',
    theme: {
      title: '主题设置',
      darkMode: '暗色模式',
      themeColor: '主题颜色',
      themeSuccess: '主题设置已更新',
      toggleDark: '已切换到暗色模式',
      toggleLight: '已切换到亮色模式',
    },
    fullscreen: {
      enter: '已进入全屏模式',
      exit: '已退出全屏模式',
      failed: '无法切换全屏模式',
    },
    language: '语言',
  },
  dashboard: {
    welcome: '欢迎回来，',
    today: '今天是 {date}，祝您工作愉快！',
    stats: {
      userTotal: '用户总数',
      articleTotal: '文章总数',
      commentTotal: '评论总数',
      systemHealth: '系统健康度',
    },
    quickActions: '快速操作',
    actions: {
      createArticle: '发布文章',
      addUser: '添加用户',
      reviewComments: '审核评论',
      systemSettings: '系统设置',
    },
    recentArticles: '最近文章',
    newUsers: '新增用户',
    viewMore: '查看更多',
    vipMember: 'VIP会员',
    regularMember: '普通会员',
  },
  monitor: {
    title: '实时监控面板',
    realtimePanel: '实时监控面板',
    performancePanel: '系统性能监测',
    systemLogs: '最近系统日志',
    currentOnline: '当前在线',
    todayVisits: '今日访问量',
    serverResponse: '服务器响应时间',
    apiCalls: '今日API调用',
    systemPerformance: '系统性能监测',
    cpuUsage: 'CPU使用率',
    memoryUsage: '内存使用率',
    recentLogs: '最近系统日志',
    viewAllLogs: '查看全部日志',
  },
  blogs: {
    title: '博客管理',
    list: '博客列表',
    add: '添加博客',
    search: '博客搜索',
    blogTitle: '博客标题',
    blogCategory: '博客分类',
    blogStatus: '博客状态',
    blogAuthor: '博客作者',
    blogSummary: '博客摘要',
    blogContent: '博客内容',
    blogCover: '封面图片',
    publishDate: '发布时间',
    views: '浏览量',
    comments: '评论数',
    status: {
      published: '已发布',
      draft: '草稿',
      review: '审核中',
    },
    operations: '操作',
    confirmDelete: '确定要删除这篇博客吗？',
    addSuccess: '博客添加成功',
    updateSuccess: '更新博客成功',
    deleteSuccess: '删除成功',
    deleteFailed: '删除失败',
    formIncomplete: '内容未填写完整',
    backToList: '返回列表',
    titlePlaceholder: '请输入博客标题关键词',
    selectCategory: '请选择博客分类',
    selectStatus: '请选择博客状态',
    enterTitle: '请输入博客标题',
    enterSummary: '请输入博客摘要',
    enterAuthor: '请输入博客作者',
    enterCoverUrl: '请输入封面图片链接',
    enterContent: '请输入博客内容',
    formError: '表单填写有误，请检查',
    rules: {
      categoryRequired: '请选择博客分类',
      titleRequired: '请输入博客标题',
      summaryRequired: '请输入博客摘要',
      authorRequired: '请输入博客作者',
      dateRequired: '请选择发布时间',
      statusRequired: '请选择博客状态',
      contentRequired: '请输入博客内容',
    },
  },
  errors: {
    notFound: '404 页面不存在',
    notFoundDesc: '抱歉，您访问的页面不存在或已被移除',
    forbidden: '403 访问被禁止',
    forbiddenDesc: '抱歉，您没有权限访问此页面',
    serverError: '500 服务器错误',
    serverErrorDesc: '抱歉，服务器遇到了问题，请稍后再试',
    backHome: '返回首页',
    backPrev: '返回上一页',
    refresh: '刷新页面',
  },
  footer: {
    copyright: '© {year} 后台管理系统',
    designBy: 'Design by',
  },
  menu: {
    home: '首页',
    dashboard: 'Dashboard',
    mainConsole: '中控台',
    monitorConsole: '监控台',
    blogs: '博客管理',
    blogsList: '博客列表',
    addBlog: '添加博客',
    error: '错误页面',
    forbidden: '403 - 无权限访问',
    notFoundPage: '404 - 页面不存在',
    serverError: '500 - 服务器错误',
    login: '登录',
  },
}
