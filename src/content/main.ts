console.log('Vue Quick Extension - Content Script 已加载')

// 动态注入CSS样式
const cssContent = `
/* Vue Extension 通知样式 */
.vue-extension-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 500;
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
  max-width: 300px;
  word-wrap: break-word;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Vue Extension 悬浮按钮样式 */
.vue-extension-float-btn {
  position: fixed;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 按钮位置样式 */
.vue-extension-float-btn[data-position="bottom-right"] {
  bottom: 20px;
  right: 20px;
}

.vue-extension-float-btn[data-position="bottom-left"] {
  bottom: 20px;
  left: 20px;
}

.vue-extension-float-btn[data-position="top-right"] {
  top: 20px;
  right: 20px;
}

.vue-extension-float-btn[data-position="top-left"] {
  top: 20px;
  left: 20px;
}

.vue-extension-float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.vue-extension-float-btn:active {
  transform: scale(0.95);
}

/* 防止与网站样式冲突 */
.vue-extension-notification,
.vue-extension-float-btn {
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}
`

// 注入CSS到页面
const style = document.createElement('style')
style.textContent = cssContent
document.head.appendChild(style)

// 监听来自popup或background的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到消息:', message)
  
  switch (message.type) {
    case 'HELLO_FROM_POPUP':
      showNotification(message.data.message)
      sendResponse({ success: true })
      break
    
    case 'GET_PAGE_INFO':
      const pageInfo = {
        title: document.title,
        url: window.location.href,
        domain: window.location.hostname
      }
      sendResponse(pageInfo)
      break
    
    default:
      console.log('未知消息类型:', message.type)
  }
  
  return true // 保持消息通道开放
})

// 显示通知
async function showNotification(message: string) {
  // 检查是否启用通知
  const result = await chrome.storage.sync.get(['notifications'])
  if (result.notifications === false) {
    return
  }
  
  const notification = document.createElement('div')
  notification.className = 'vue-extension-notification'
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  // 更新通知统计
  updateNotificationStats()
  
  // 3秒后自动消失
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

async function updateNotificationStats() {
  try {
    const result = await chrome.storage.sync.get(['stats'])
    const stats = result.stats || { totalClicks: 0, totalNotifications: 0, daysUsed: 0 }
    stats.totalNotifications += 1
    await chrome.storage.sync.set({ stats })
  } catch (error) {
    console.error('更新通知统计失败:', error)
  }
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

async function init() {
  console.log('Vue Quick Extension - 内容脚本初始化完成')
  
  // 检查插件是否启用
  const result = await chrome.storage.sync.get(['extensionEnabled'])
  if (result.extensionEnabled === false) {
    console.log('插件已禁用')
    return
  }
  
  // 这里可以添加页面交互逻辑
  // 例如：添加悬浮按钮、修改页面样式等
  
  // 示例：添加一个悬浮按钮
  createFloatingButton()
}

async function createFloatingButton() {
  // 检查是否启用悬浮按钮
  const result = await chrome.storage.sync.get(['floatingButton', 'buttonPosition'])
  if (result.floatingButton === false) {
    return
  }
  
  const button = document.createElement('button')
  button.className = 'vue-extension-float-btn'
  button.innerHTML = '🚀'
  button.title = 'Vue Quick Extension'
  
  // 设置按钮位置
  const position = result.buttonPosition || 'bottom-right'
  button.setAttribute('data-position', position)
  
  button.addEventListener('click', () => {
    showNotification('Hello from Vue Extension!')
    // 更新点击统计
    updateClickStats()
  })
  
  document.body.appendChild(button)
}

async function updateClickStats() {
  try {
    const result = await chrome.storage.sync.get(['stats'])
    const stats = result.stats || { totalClicks: 0, totalNotifications: 0, daysUsed: 0 }
    stats.totalClicks += 1
    await chrome.storage.sync.set({ stats })
  } catch (error) {
    console.error('更新统计失败:', error)
  }
} 