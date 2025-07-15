import { ref, reactive, watch } from 'vue'

// 设置接口定义
interface Settings {
  enableCustomBackground: boolean
  customBackgroundUrl: string
  openInNewTab: boolean
  preferredSearchEngine: string
}

// 默认设置
const defaultSettings: Settings = {
  enableCustomBackground: false,
  customBackgroundUrl: '',
  openInNewTab: false,
  preferredSearchEngine: 'Google'
}

// 设置键名
const SETTINGS_KEY = 'newtab-settings'

// 响应式设置对象
const settings = reactive<Settings>({ ...defaultSettings })

// 从本地存储加载设置
const loadSettings = (): Settings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...defaultSettings, ...parsed }
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
  return { ...defaultSettings }
}

// 保存设置到本地存储
const saveSettings = (settingsToSave: Settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave))
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

// 更新单个设置项
const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
  settings[key] = value
  saveSettings(settings)
}

// 重置所有设置
const resetAllSettings = () => {
  Object.assign(settings, defaultSettings)
  saveSettings(settings)
}

// 获取设置值
const getSetting = <K extends keyof Settings>(key: K): Settings[K] => {
  return settings[key]
}

// 导出设置管理hook
export const useSettings = () => {
  // 初始化时加载设置
  const loadedSettings = loadSettings()
  Object.assign(settings, loadedSettings)

  // 监听设置变化并自动保存
  watch(
    () => settings,
    (newSettings) => {
      saveSettings(newSettings)
    },
    { deep: true }
  )

  return {
    settings,
    updateSetting,
    resetAllSettings,
    getSetting,
    loadSettings,
    saveSettings
  }
}

// 搜索引擎相关设置
export const useSearchEngineSettings = () => {
  const { settings, updateSetting } = useSettings()

  const setPreferredSearchEngine = (engineName: string) => {
    updateSetting('preferredSearchEngine', engineName)
  }

  const getPreferredSearchEngine = () => {
    return settings.preferredSearchEngine
  }

  return {
    setPreferredSearchEngine,
    getPreferredSearchEngine
  }
}

// 背景相关设置
export const useBackgroundSettings = () => {
  const { settings, updateSetting } = useSettings()

  const setCustomBackground = (enabled: boolean, url?: string) => {
    updateSetting('enableCustomBackground', enabled)
    if (url !== undefined) {
      updateSetting('customBackgroundUrl', url)
    }
  }

  const getBackgroundSettings = () => {
    return {
      enabled: settings.enableCustomBackground,
      url: settings.customBackgroundUrl
    }
  }

  return {
    setCustomBackground,
    getBackgroundSettings
  }
} 