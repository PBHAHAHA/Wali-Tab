<template>
  <div class="quick-links-container">
    <div class="quick-links-header">
      <h2>快捷链接</h2>
      <button @click="$emit('openManager')" class="manage-btn" title="管理快捷链接">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
      </button>
    </div>
    
    <div class="categories-container">
      <div 
        v-for="category in sortedCategories" 
        :key="category.id"
        class="category-section"
        v-show="linksByCategory[category.id]?.length > 0"
      >
        <div class="category-header">
          <div class="category-info">
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">({{ linksByCategory[category.id]?.length || 0 }})</span>
          </div>
        </div>
        
        <div class="links-grid">
          <div
            v-for="(link, index) in linksByCategory[category.id]"
            :key="link.id"
            class="link-item"
            @click="openLink(link)"
            :title="`${link.title}${link.description ? ' - ' + link.description : ''}\n${link.url}`"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <div class="link-icon">
              <span v-if="link.icon">{{ link.icon }}</span>
              <div v-else class="default-icon">{{ link.title.charAt(0).toUpperCase() }}</div>
            </div>
            <div class="link-title">{{ link.title }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="totalLinks === 0" class="empty-state">
      <div class="empty-icon">🔗</div>
      <div class="empty-text">还没有快捷链接</div>
      <div class="empty-desc">点击右上角按钮添加您常用的网站</div>
      <button @click="$emit('openManager')" class="add-first-btn">添加第一个链接</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { useQuickLinks, type QuickLink, type Category } from '../composables/useQuickLinks'
import { useSettings } from '../composables/useSettings'

const emit = defineEmits<{
  openManager: []
}>()

const { linksByCategory, categories, getCategoryById } = useQuickLinks()
const { settings } = useSettings()

// 排序后的分类
const sortedCategories = computed(() => {
  return [...categories].sort((a, b) => a.order - b.order)
})

// 总链接数
const totalLinks = computed(() => {
  return Object.values(linksByCategory).flat().length
})

// 打开链接
const openLink = (link: QuickLink) => {
  const url = link.url.startsWith('http') ? link.url : `https://${link.url}`
  
  if (settings.openInNewTab) {
    window.open(url, '_blank')
  } else {
    window.location.href = url
  }
}

// 格式化URL显示
const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.hostname
  } catch {
    return url
  }
}
</script>

<style scoped>
.quick-links-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.quick-links-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.quick-links-header h2 {
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.manage-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.manage-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.category-header {
  margin-bottom: 16px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 20px;
}

.category-name {
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.category-count {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
}

.link-item {
  /* background: rgba(255, 255, 255, 0.9); */
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  /* border: 1px solid rgba(255, 255, 255, 0.3); */
  text-align: center;
  color: #fff;
}

.link-item:hover {
  /* background: rgba(255, 255, 255, 0.95); */
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.link-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(0, 0, 0, .5);
  flex-shrink: 0;
}

.link-icon span {
  font-size: 16px;
}

.default-icon {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.link-title {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.empty-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
}

.add-first-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.add-first-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quick-links-container {
    padding: 16px;
  }
  
  .quick-links-header h2 {
    font-size: 20px;
  }
  
  .links-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 6px;
  }
  
  .category-section {
    padding: 16px;
  }
  
  .link-item {
    padding: 8px;
  }
  
  .link-icon {
    width: 28px;
    height: 28px;
  }
  
  .link-icon span {
    font-size: 14px;
  }
  
  .default-icon {
    font-size: 12px;
  }
  
  .link-title {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .quick-links-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .manage-btn {
    align-self: flex-end;
  }
  
  .categories-container {
    gap: 16px;
  }
  
  .category-section {
    padding: 12px;
  }
  
  .links-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 4px;
  }
  
  .link-item {
    padding: 6px;
    gap: 4px;
  }
  
  .link-icon {
    width: 24px;
    height: 24px;
  }
  
  .link-icon span {
    font-size: 12px;
  }
  
  .default-icon {
    font-size: 10px;
  }
  
  .link-title {
    font-size: 11px;
  }
}

/* 加载动画 */
.link-item {
  opacity: 0;
  animation: fadeInUp 0.4s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 