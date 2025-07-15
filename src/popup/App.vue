<template>
  <div class="popup-container">
    <header class="popup-header">
      <h1>Vue Quick Extension</h1>
      <p class="version">v1.0.0</p>
    </header>
    
    <main class="popup-main">
      <div class="feature-card">
        <h3>🚀 功能特性</h3>
        <ul>
          <li>Vue 3 + TypeScript</li>
          <li>Vite 构建工具</li>
          <li>热重载开发</li>
          <li>现代化UI设计</li>
        </ul>
      </div>
      
      <div class="actions">
        <button @click="handleOptionsClick" class="btn btn-primary">
          设置选项
        </button>
        <button @click="handleTabAction" class="btn btn-secondary">
          操作当前标签页
        </button>
      </div>
    </main>
    
    <footer class="popup-footer">
      <p>基于Vue的浏览器插件脚手架</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const handleOptionsClick = () => {
  console.log('点击了设置选项按钮')
  console.log('chrome.runtime:', chrome.runtime)
  console.log('chrome.runtime.openOptionsPage:', chrome.runtime.openOptionsPage)
  
  try {
    if (chrome.runtime.openOptionsPage) {
      console.log('调用 chrome.runtime.openOptionsPage()')
      chrome.runtime.openOptionsPage()
    } else {
      console.log('chrome.runtime.openOptionsPage 不存在，使用备选方案')
      // 备选方案：直接打开选项页面
      const optionsUrl = chrome.runtime.getURL('options.html')
      console.log('选项页面URL:', optionsUrl)
      window.open(optionsUrl)
    }
  } catch (error) {
    console.error('打开选项页面失败:', error)
    // 如果所有方法都失败，尝试直接打开选项页面
    try {
      const optionsUrl = chrome.runtime.getURL('options.html')
      console.log('使用备选方案打开选项页面:', optionsUrl)
      window.open(optionsUrl)
    } catch (fallbackError) {
      console.error('备选方案也失败了:', fallbackError)
    }
  }
}

const handleTabAction = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'HELLO_FROM_POPUP',
        data: { message: '来自弹出窗口的消息' }
      })
    }
  } catch (error) {
    console.error('发送消息到标签页失败:', error)
  }
}
</script>

<style scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.popup-header {
  padding: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.popup-header h1 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
}

.version {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.popup-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.feature-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.feature-card ul {
  margin: 0;
  padding-left: 20px;
}

.feature-card li {
  margin-bottom: 5px;
  font-size: 12px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.popup-footer {
  padding: 15px;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
  font-size: 11px;
  opacity: 0.8;
}

.popup-footer p {
  margin: 0;
}
</style> 