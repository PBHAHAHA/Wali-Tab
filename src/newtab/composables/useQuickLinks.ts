import { ref, reactive, computed, watch } from 'vue'

// 快捷链接接口定义
export interface QuickLink {
  id: string
  title: string
  url: string
  icon?: string
  description?: string
  categoryId: string
  order: number
  createdAt: number
  updatedAt: number
}

// 分类接口定义
export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  order: number
  createdAt: number
  updatedAt: number
}

// 默认分类
const defaultCategories: Category[] = [
  {
    id: 'work',
    name: '工作',
    icon: '💼',
    color: '#007AFF',
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'social',
    name: '社交',
    icon: '👥',
    color: '#34C759',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'entertainment',
    name: '娱乐',
    icon: '🎮',
    color: '#FF9500',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'tools',
    name: '工具',
    icon: '🔧',
    color: '#5856D6',
    order: 3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]

// 默认快捷链接
const defaultQuickLinks: QuickLink[] = [
  // 工作类
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com',
    icon: '🐙',
    description: '代码托管平台',
    categoryId: 'work',
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'stackoverflow',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    icon: '📚',
    description: '编程问答社区',
    categoryId: 'work',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'npmjs',
    title: 'NPM',
    url: 'https://www.npmjs.com',
    icon: '📦',
    description: 'Node.js包管理器',
    categoryId: 'work',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mdn',
    title: 'MDN',
    url: 'https://developer.mozilla.org',
    icon: '📖',
    description: 'Web开发文档',
    categoryId: 'work',
    order: 3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  
  // 社交类
  {
    id: 'wechat',
    title: '微信网页版',
    url: 'https://wx.qq.com',
    icon: '💬',
    description: '微信网页版',
    categoryId: 'social',
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'weibo',
    title: '微博',
    url: 'https://weibo.com',
    icon: '🔥',
    description: '社交媒体平台',
    categoryId: 'social',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'twitter',
    title: 'Twitter',
    url: 'https://twitter.com',
    icon: '🐦',
    description: '社交媒体平台',
    categoryId: 'social',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  
  // 娱乐类
  {
    id: 'bilibili',
    title: '哔哩哔哩',
    url: 'https://www.bilibili.com',
    icon: '📺',
    description: '视频分享网站',
    categoryId: 'entertainment',
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'youtube',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    icon: '🎬',
    description: '视频分享平台',
    categoryId: 'entertainment',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'netflix',
    title: 'Netflix',
    url: 'https://www.netflix.com',
    icon: '🎭',
    description: '流媒体平台',
    categoryId: 'entertainment',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'douyin',
    title: '抖音',
    url: 'https://www.douyin.com',
    icon: '🎵',
    description: '短视频平台',
    categoryId: 'entertainment',
    order: 3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  
  // 工具类
  {
    id: 'translate',
    title: '谷歌翻译',
    url: 'https://translate.google.com',
    icon: '🌐',
    description: '在线翻译工具',
    categoryId: 'tools',
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'canva',
    title: 'Canva',
    url: 'https://www.canva.com',
    icon: '🎨',
    description: '在线设计工具',
    categoryId: 'tools',
    order: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'notion',
    title: 'Notion',
    url: 'https://www.notion.so',
    icon: '📝',
    description: '笔记和协作工具',
    categoryId: 'tools',
    order: 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'figma',
    title: 'Figma',
    url: 'https://www.figma.com',
    icon: '🎯',
    description: '界面设计工具',
    categoryId: 'tools',
    order: 3,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]

// 存储键名
const QUICKLINKS_KEY = 'newtab-quicklinks'
const CATEGORIES_KEY = 'newtab-categories'

// 响应式数据
const quickLinks = ref<QuickLink[]>([])
const categories = ref<Category[]>([])

// 工具函数
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const loadData = () => {
  try {
    // 加载分类
    const savedCategories = localStorage.getItem(CATEGORIES_KEY)
    if (savedCategories) {
      categories.value = JSON.parse(savedCategories)
    } else {
      categories.value = [...defaultCategories]
    }

    // 加载快捷链接
    const savedQuickLinks = localStorage.getItem(QUICKLINKS_KEY)
    if (savedQuickLinks) {
      quickLinks.value = JSON.parse(savedQuickLinks)
    } else {
      quickLinks.value = [...defaultQuickLinks]
    }
  } catch (error) {
    console.error('加载快捷链接数据失败:', error)
    categories.value = [...defaultCategories]
    quickLinks.value = [...defaultQuickLinks]
  }
}

const saveData = () => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories.value))
    localStorage.setItem(QUICKLINKS_KEY, JSON.stringify(quickLinks.value))
  } catch (error) {
    console.error('保存快捷链接数据失败:', error)
  }
}

// 快捷链接管理
export const useQuickLinks = () => {
  // 初始化数据
  if (quickLinks.value.length === 0) {
    loadData()
  }

  // 监听数据变化并自动保存
  watch([quickLinks, categories], saveData, { deep: true })

  // 按分类分组的快捷链接
  const linksByCategory = computed(() => {
    const grouped: Record<string, QuickLink[]> = {}
    
    categories.value.forEach(category => {
      grouped[category.id] = quickLinks.value
        .filter(link => link.categoryId === category.id)
        .sort((a, b) => a.order - b.order)
    })
    
    return grouped
  })

  // 获取分类信息
  const getCategoryById = (id: string) => {
    return categories.value.find(cat => cat.id === id)
  }

  // 添加快捷链接
  const addQuickLink = (linkData: Omit<QuickLink, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLink: QuickLink = {
      ...linkData,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    quickLinks.value.push(newLink)
    return newLink
  }

  // 更新快捷链接
  const updateQuickLink = (id: string, updates: Partial<QuickLink>) => {
    const index = quickLinks.value.findIndex(link => link.id === id)
    if (index !== -1) {
      quickLinks.value[index] = {
        ...quickLinks.value[index],
        ...updates,
        updatedAt: Date.now()
      }
      return quickLinks.value[index]
    }
    return null
  }

  // 删除快捷链接
  const deleteQuickLink = (id: string) => {
    const index = quickLinks.value.findIndex(link => link.id === id)
    if (index !== -1) {
      quickLinks.value.splice(index, 1)
      return true
    }
    return false
  }

  // 移动快捷链接顺序
  const moveQuickLink = (id: string, newOrder: number, newCategoryId?: string) => {
    const link = quickLinks.value.find(l => l.id === id)
    if (link) {
      updateQuickLink(id, { 
        order: newOrder, 
        categoryId: newCategoryId || link.categoryId 
      })
    }
  }

  // 添加分类
  const addCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    categories.value.push(newCategory)
    return newCategory
  }

  // 更新分类
  const updateCategory = (id: string, updates: Partial<Category>) => {
    const index = categories.value.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        ...updates,
        updatedAt: Date.now()
      }
      return categories.value[index]
    }
    return null
  }

  // 删除分类
  const deleteCategory = (id: string) => {
    // 先删除该分类下的所有链接
    quickLinks.value = quickLinks.value.filter(link => link.categoryId !== id)
    
    // 再删除分类
    const index = categories.value.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      return true
    }
    return false
  }

  // 重置数据
  const resetData = () => {
    categories.value = [...defaultCategories]
    quickLinks.value = [...defaultQuickLinks]
    saveData()
  }

  // 导出数据
  const exportData = () => {
    return {
      categories: categories.value,
      quickLinks: quickLinks.value,
      exportTime: Date.now()
    }
  }

  // 导入数据
  const importData = (data: { categories: Category[], quickLinks: QuickLink[] }) => {
    try {
      categories.value = data.categories || []
      quickLinks.value = data.quickLinks || []
      saveData()
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }

  return {
    // 数据
    quickLinks: quickLinks.value,
    categories: categories.value,
    linksByCategory,
    
    // 工具函数
    getCategoryById,
    
    // 快捷链接操作
    addQuickLink,
    updateQuickLink,
    deleteQuickLink,
    moveQuickLink,
    
    // 分类操作
    addCategory,
    updateCategory,
    deleteCategory,
    
    // 数据管理
    resetData,
    exportData,
    importData,
    loadData,
    saveData
  }
} 