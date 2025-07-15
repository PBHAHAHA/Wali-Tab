<template>
  <div class="settings-panel" :class="{ show: isVisible }">
    <div class="settings-overlay" @click="closeSettings"></div>
    <div class="settings-content">
      <div class="settings-header">
        <h2>设置</h2>
        <button @click="closeSettings" class="close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="settings-body">
        <!-- 搜索引擎设置 -->
        <div class="setting-section">
          <h3>默认搜索引擎</h3>
          <div class="engine-options">
            <label 
              v-for="engine in searchEngines" 
              :key="engine.name"
              class="engine-option"
            >
              <input 
                type="radio" 
                :value="engine.name"
                v-model="selectedEngine"
                @change="updateSearchEngine(engine)"
              />
              <span>{{ engine.name }}</span>
            </label>
          </div>
        </div>

        <!-- 背景设置 -->
        <div class="setting-section">
          <h3>背景设置</h3>
          <div class="background-options">
            <label class="setting-option">
              <input 
                type="checkbox"
                v-model="settings.enableCustomBackground"
                @change="updateSetting('enableCustomBackground', $event.target.checked)"
              />
              <span>启用自定义背景</span>
            </label>
            <div v-if="settings.enableCustomBackground" class="custom-background-input">
              <input 
                type="url"
                v-model="settings.customBackgroundUrl"
                @change="updateSetting('customBackgroundUrl', $event.target.value)"
                placeholder="输入背景图片URL"
                class="url-input"
              />
            </div>
          </div>
        </div>

        <!-- 快捷键设置 */
        <div class="setting-section">
          <h3>快捷键</h3>
          <div class="shortcuts-info">
            <div class="shortcut-item">
              <span class="shortcut-key">Enter</span>
              <span class="shortcut-desc">执行搜索</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl + K</span>
              <span class="shortcut-desc">聚焦搜索框</span>
            </div>
          </div>
        </div>

        <!-- 其他设置 -->
        <div class="setting-section">
          <h3>其他</h3>
          <label class="setting-option">
            <input 
              type="checkbox"
              v-model="settings.openInNewTab"
              @change="updateSetting('openInNewTab', $event.target.checked)"
            />
            <span>在新标签页中打开搜索结果</span>
          </label>
        </div>
      </div>

      <div class="settings-footer">
        <button @click="resetSettings" class="reset-btn">重置设置</button>
        <button @click="closeSettings" class="save-btn">保存并关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { useSettings } from '../composables/useSettings'

interface Props {
  isVisible: boolean
  searchEngines: Array<{ name: string; url: string }>
  currentEngine: { name: string; url: string }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  engineChange: [engine: { name: string; url: string }]
}>()

const { settings, updateSetting, resetAllSettings } = useSettings()
const selectedEngine = ref(props.currentEngine.name)

const closeSettings = () => {
  emit('close')
}

const updateSearchEngine = (engine: { name: string; url: string }) => {
  emit('engineChange', engine)
}

const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？')) {
    resetAllSettings()
    selectedEngine.value = props.searchEngines[0].name
    updateSearchEngine(props.searchEngines[0])
  }
}

onMounted(() => {
  selectedEngine.value = props.currentEngine.name
})
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.settings-panel.show {
  opacity: 1;
  visibility: visible;
}

.settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.settings-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.settings-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.setting-section {
  margin-bottom: 24px;
}

.setting-section h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.engine-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.engine-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.engine-option:hover {
  background: rgba(0, 0, 0, 0.05);
}

.engine-option input[type="radio"] {
  margin: 0;
}

.setting-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 0;
}

.setting-option input[type="checkbox"] {
  margin: 0;
}

.custom-background-input {
  margin-top: 12px;
}

.url-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.url-input:focus {
  border-color: #007AFF;
}

.shortcuts-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.shortcut-key {
  background: rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.shortcut-desc {
  color: #666;
  font-size: 14px;
}

.settings-footer {
  display: flex;
  justify-content: space-between;
  padding: 20px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.reset-btn {
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #666;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.save-btn {
  background: #007AFF;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.save-btn:hover {
  background: #0056CC;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .settings-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .settings-header,
  .settings-body,
  .settings-footer {
    padding: 16px 20px;
  }
  
  .settings-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .reset-btn,
  .save-btn {
    width: 100%;
  }
}
</style> 