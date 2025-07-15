<template>
  <div class="options-container">
    <header class="options-header">
      <h1>Vue Quick Extension</h1>
      <p class="subtitle">设置选项</p>
    </header>
    
    <main class="options-main">
      <div class="settings-section">
        <h2>🔧 基本设置</h2>
        
        <div class="setting-item">
          <label class="setting-label">
            <input 
              type="checkbox" 
              v-model="settings.extensionEnabled"
              @change="saveSetting('extensionEnabled', settings.extensionEnabled)"
            >
            <span class="checkmark"></span>
            启用插件
          </label>
          <p class="setting-description">开启或关闭插件功能</p>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">
            <input 
              type="checkbox" 
              v-model="settings.notifications"
              @change="saveSetting('notifications', settings.notifications)"
            >
            <span class="checkmark"></span>
            显示通知
          </label>
          <p class="setting-description">允许插件显示通知消息</p>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">
            <input 
              type="checkbox" 
              v-model="settings.floatingButton"
              @change="saveSetting('floatingButton', settings.floatingButton)"
            >
            <span class="checkmark"></span>
            显示悬浮按钮
          </label>
          <p class="setting-description">在网页上显示悬浮操作按钮</p>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>🎨 外观设置</h2>
        
        <div class="setting-item">
          <label class="setting-label">主题选择</label>
          <select 
            v-model="settings.theme" 
            @change="saveSetting('theme', settings.theme)"
            class="theme-select"
          >
            <option value="default">默认</option>
            <option value="dark">深色</option>
            <option value="light">浅色</option>
          </select>
          <p class="setting-description">选择插件界面主题</p>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">按钮位置</label>
          <select 
            v-model="settings.buttonPosition" 
            @change="saveSetting('buttonPosition', settings.buttonPosition)"
            class="theme-select"
          >
            <option value="bottom-right">右下角</option>
            <option value="bottom-left">左下角</option>
            <option value="top-right">右上角</option>
            <option value="top-left">左上角</option>
          </select>
          <p class="setting-description">设置悬浮按钮显示位置</p>
        </div>
      </div>
      
      <div class="settings-section">
        <h2>📊 使用统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalClicks }}</div>
            <div class="stat-label">总点击次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalNotifications }}</div>
            <div class="stat-label">通知次数</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.daysUsed }}</div>
            <div class="stat-label">使用天数</div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="resetSettings" class="btn btn-secondary">
          重置设置
        </button>
        <button @click="exportSettings" class="btn btn-primary">
          导出设置
        </button>
      </div>
    </main>
    
    <footer class="options-footer">
      <p>Vue Quick Extension v1.0.0</p>
      <p>基于Vue 3 + TypeScript + Vite构建</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 设置数据
const settings = ref({
  extensionEnabled: true,
  notifications: true,
  floatingButton: true,
  theme: 'default',
  buttonPosition: 'bottom-right'
})

// 统计数据
const stats = ref({
  totalClicks: 0,
  totalNotifications: 0,
  daysUsed: 0
})

// 加载设置
const loadSettings = async () => {
  try {
    const result = await chrome.storage.sync.get([
      'extensionEnabled',
      'notifications', 
      'floatingButton',
      'theme',
      'buttonPosition',
      'stats'
    ])
    
    // 更新设置
    Object.keys(settings.value).forEach(key => {
      if (result[key] !== undefined) {
        settings.value[key] = result[key]
      }
    })
    
    // 更新统计
    if (result.stats) {
      stats.value = { ...stats.value, ...result.stats }
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// 保存设置
const saveSetting = async (key: string, value: any) => {
  try {
    await chrome.storage.sync.set({ [key]: value })
    console.log(`设置已保存: ${key} = ${value}`)
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

// 重置设置
const resetSettings = async () => {
  if (confirm('确定要重置所有设置吗？')) {
    try {
      await chrome.storage.sync.clear()
      settings.value = {
        extensionEnabled: true,
        notifications: true,
        floatingButton: true,
        theme: 'default',
        buttonPosition: 'bottom-right'
      }
      
      // 重新保存默认设置
      await chrome.storage.sync.set(settings.value)
      alert('设置已重置')
    } catch (error) {
      console.error('重置设置失败:', error)
    }
  }
}

// 导出设置
const exportSettings = async () => {
  try {
    const result = await chrome.storage.sync.get(null)
    const dataStr = JSON.stringify(result, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vue-extension-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出设置失败:', error)
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.options-container {
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
}

.options-header {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.options-header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.8;
}

.options-main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.settings-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.settings-section h2 {
  margin: 0 0 25px 0;
  font-size: 20px;
  font-weight: 600;
}

.setting-item {
  margin-bottom: 25px;
}

.setting-label {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 8px;
}

.setting-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.setting-label input[type="checkbox"]:checked + .checkmark {
  background: #4CAF50;
  border-color: #4CAF50;
}

.setting-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
}

.theme-select {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  margin-top: 8px;
}

.theme-select option {
  background: #333;
  color: white;
}

.setting-description {
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
  margin-left: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.options-footer {
  text-align: center;
  padding: 30px;
  background: rgba(0, 0, 0, 0.2);
  font-size: 14px;
  opacity: 0.8;
}

.options-footer p {
  margin: 5px 0;
}
</style> 