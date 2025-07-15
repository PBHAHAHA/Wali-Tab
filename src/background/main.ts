console.log('Vue Quick Extension - Background Script 已启动')

// 插件安装或更新时执行
chrome.runtime.onInstalled.addListener((details) => {
  console.log('插件已安装/更新:', details.reason)
  
  if (details.reason === 'install') {
    // 首次安装时的初始化逻辑
    console.log('欢迎使用 Vue Quick Extension!')
    
    // 可以在这里设置默认配置
    chrome.storage.sync.set({
      extensionEnabled: true,
      theme: 'default',
      notifications: true
    })
  }
})

// 监听来自content script和popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background收到消息:', message)
  
  switch (message.type) {
    case 'GET_STORAGE_DATA':
      handleGetStorageData(message.key, sendResponse)
      break
    
    case 'SET_STORAGE_DATA':
      handleSetStorageData(message.key, message.value, sendResponse)
      break
    
    case 'OPEN_OPTIONS_PAGE':
      chrome.runtime.openOptionsPage()
      sendResponse({ success: true })
      break
    
    default:
      console.log('未知消息类型:', message.type)
  }
  
  return true // 保持消息通道开放
})

// 处理存储数据获取
async function handleGetStorageData(key: string, sendResponse: (response: any) => void) {
  try {
    const result = await chrome.storage.sync.get(key)
    sendResponse({ success: true, data: result[key] })
  } catch (error) {
    console.error('获取存储数据失败:', error)
    sendResponse({ success: false, error: error.message })
  }
}

// 处理存储数据设置
async function handleSetStorageData(key: string, value: any, sendResponse: (response: any) => void) {
  try {
    await chrome.storage.sync.set({ [key]: value })
    sendResponse({ success: true })
  } catch (error) {
    console.error('设置存储数据失败:', error)
    sendResponse({ success: false, error: error.message })
  }
}

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('标签页加载完成:', tab.url)
    
    // 可以在这里执行一些页面加载完成后的逻辑
    // 例如：检查页面内容、更新插件状态等
  }
})

// 监听标签页激活
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('标签页已激活:', activeInfo.tabId)
  
  // 可以在这里更新插件图标或执行其他逻辑
})

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'vue-extension-menu',
    title: 'Vue Quick Extension',
    contexts: ['page', 'selection']
  })
})

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'vue-extension-menu') {
    console.log('右键菜单被点击')
    
    // 向当前标签页发送消息
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'CONTEXT_MENU_CLICKED',
        data: { 
          selectedText: info.selectionText,
          pageUrl: info.pageUrl
        }
      })
    }
  }
}) 