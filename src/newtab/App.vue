<template>
  <div class="newtab-container" :style="backgroundStyle">
    <!-- 设置按钮 -->
    <SettingsButton 
      :is-active="showSettings"
      @toggle="toggleSettings"
    />
    
    <!-- 设置面板 -->
    <SettingsPanel 
      :is-visible="showSettings"
      :search-engines="searchEngines"
      :current-engine="currentEngine"
      @close="closeSettings"
      @engine-change="handleEngineChange"
      @open-quick-links-manager="openQuickLinksManagerFromSettings"
    />
    
    <div class="main-content" :class="{ 'centered': !settings.showQuickLinks }">
      <div class="search-container">
        <div class="search-engines">
          <button 
            v-for="engine in searchEngines" 
            :key="engine.name"
            @click="setSearchEngine(engine)"
            :class="['engine-btn', { active: currentEngine.name === engine.name }]"
          >
            {{ engine.name }}
          </button>
        </div>
        <input 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          @keydown="handleKeydown"
          type="text"
          :placeholder="`在 ${currentEngine.name} 中搜索或输入网址`"
          class="search-input"
          ref="searchInput"
          autofocus
        />
      </div>
      
      <!-- 快捷链接区域 -->
      <transition name="quicklinks-fade">
        <div v-if="settings.showQuickLinks" class="quicklinks-section">
          <QuickLinks @open-manager="openQuickLinksManager" />
        </div>
      </transition>
    </div>
    
    <!-- 快捷链接管理器 -->
    <QuickLinksManager 
      :is-visible="showQuickLinksManager"
      @close="closeQuickLinksManager"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import SettingsButton from './components/SettingsButton.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import QuickLinks from './components/QuickLinks.vue'
import QuickLinksManager from './components/QuickLinksManager.vue'
import { useSettings, useBackgroundSettings } from './composables/useSettings'

const searchQuery = ref('')
const showSettings = ref(false)
const showQuickLinksManager = ref(false)
const searchInput = ref<HTMLInputElement>()

// 使用设置管理
const { settings } = useSettings()
const { getBackgroundSettings } = useBackgroundSettings()

// 搜索引擎配置
const searchEngines = ref([
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: '百度', url: 'https://www.baidu.com/s?wd=' },
  { name: '必应', url: 'https://www.bing.com/search?q=' },
  { name: 'GitHub', url: 'https://github.com/search?q=' }
])

const currentEngine = ref(searchEngines.value[0]) // 默认Google

// 背景样式计算
const backgroundStyle = computed(() => {
  const bgSettings = getBackgroundSettings()
  if (bgSettings.enabled && bgSettings.url) {
    return {
      backgroundImage: `url(${bgSettings.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
  return {
    // backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
    // backgroundImage: "url('/imgs/karsten-winegeart-AW76trwVU08-unsplash.jpg')"
    backgroundImage: "url('/imgs/bg01.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})

// 搜索处理
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  const query = searchQuery.value.trim()
  
  // 判断是否为网址
  if (query.includes('.') && !query.includes(' ') && currentEngine.value.name !== 'GitHub') {
    const url = query.startsWith('http') ? query : `https://${query}`
    if (settings.openInNewTab) {
      window.open(url, '_blank')
    } else {
      window.location.href = url
    }
  } else {
    // 使用选定的搜索引擎
    const searchUrl = currentEngine.value.url + encodeURIComponent(query)
    if (settings.openInNewTab) {
      window.open(searchUrl, '_blank')
    } else {
      window.location.href = searchUrl
    }
  }
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl + K 聚焦搜索框
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
  
  // Esc 关闭设置面板
  if (event.key === 'Escape' && showSettings.value) {
    closeSettings()
  }
}

// 设置搜索引擎
const setSearchEngine = (engine: { name: string; url: string }) => {
  currentEngine.value = engine
  // 保存到本地存储
  localStorage.setItem('preferredSearchEngine', JSON.stringify(engine))
}

// 处理引擎变更
const handleEngineChange = (engine: { name: string; url: string }) => {
  setSearchEngine(engine)
}

// 设置面板控制
const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const closeSettings = () => {
  showSettings.value = false
  // 关闭设置后重新聚焦搜索框
  nextTick(() => {
    searchInput.value?.focus()
  })
}

// 快捷链接管理器控制
const openQuickLinksManager = () => {
  showQuickLinksManager.value = true
}

const closeQuickLinksManager = () => {
  showQuickLinksManager.value = false
  // 关闭管理器后重新聚焦搜索框
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const openQuickLinksManagerFromSettings = () => {
  // 先关闭设置面板
  closeSettings()
  // 然后打开快捷链接管理器
  setTimeout(() => {
    openQuickLinksManager()
  }, 100)
}

// 加载保存的搜索引擎设置
const loadSettings = () => {
  const saved = localStorage.getItem('preferredSearchEngine')
  if (saved) {
    try {
      const engine = JSON.parse(saved)
      const found = searchEngines.value.find((e: { name: string; url: string }) => e.name === engine.name)
      if (found) {
        currentEngine.value = found
      }
    } catch (error) {
      console.error('加载搜索引擎设置失败:', error)
    }
  }
}

// 全局键盘事件监听
const handleGlobalKeydown = (event: KeyboardEvent) => {
  // Ctrl + K 全局快捷键
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => {
  loadSettings()
  // 添加全局键盘事件监听
  document.addEventListener('keydown', handleGlobalKeydown)
  
  // 清理函数
  return () => {
    document.removeEventListener('keydown', handleGlobalKeydown)
  }
})
</script>

<style scoped>
.newtab-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-image 0.3s ease;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px 20px;
  overflow-y: auto;
}

.main-content.centered {
  justify-content: center;
}

.main-content:not(.centered) {
  justify-content: flex-start;
}

.search-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
}

.main-content.centered .search-container {
  margin-bottom: 0;
  transform: translateY(-100px);
}

.quicklinks-section {
  width: 100%;
  max-width: 1200px;
  flex: 1;
}

/* 快捷链接过渡动画 */
.quicklinks-fade-enter-active,
.quicklinks-fade-leave-active {
  transition: all 0.3s ease;
}

.quicklinks-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.quicklinks-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 主内容区域过渡 */
.main-content {
  transition: justify-content 0.3s ease;
}

.main-content .search-container {
  transition: margin-bottom 0.3s ease;
}

.search-engines {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.engine-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.engine-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.engine-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input {
  width: 100%;
  padding: 16px 24px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .search-engines {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .engine-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .search-input {
    font-size: 16px;
    padding: 14px 20px;
  }
}
</style> 