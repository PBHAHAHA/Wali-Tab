<template>
  <div class="settings-button">
    <button 
      @click="toggleSettings"
      class="settings-btn"
      :class="{ active: isActive }"
      title="设置"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-3.5L19 5.5m-7 7L7.5 7.5m0 9L12 12m7-7L14.5 9.5"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  isActive?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggle: []
}>()

const toggleSettings = () => {
  emit('toggle')
}
</script>

<style scoped>
.settings-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.settings-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.settings-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  transform: rotate(45deg);
}

.settings-btn svg {
  transition: transform 0.3s ease;
}

.settings-btn:hover svg {
  transform: rotate(45deg);
}

.settings-btn.active svg {
  transform: rotate(90deg);
}
</style> 