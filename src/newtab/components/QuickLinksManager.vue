<template>
  <div class="quicklinks-manager" :class="{ show: isVisible }">
    <div class="manager-overlay" @click="closeManager"></div>
    <div class="manager-content">
      <div class="manager-header">
        <h2>快捷链接管理</h2>
        <button @click="closeManager" class="close-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="manager-tabs">
        <button 
          @click="activeTab = 'links'"
          :class="['tab-btn', { active: activeTab === 'links' }]"
        >
          链接管理
        </button>
        <button 
          @click="activeTab = 'categories'"
          :class="['tab-btn', { active: activeTab === 'categories' }]"
        >
          分类管理
        </button>
      </div>
      
      <div class="manager-body">
        <!-- 链接管理 -->
        <div v-if="activeTab === 'links'" class="tab-content">
          <div class="action-bar">
            <button @click="openLinkForm()" class="add-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              添加链接
            </button>
          </div>
          
          <div class="links-list">
            <div 
              v-for="category in sortedCategories" 
              :key="category.id"
              class="category-group"
              v-show="linksByCategory[category.id]?.length > 0"
            >
              <div class="category-title">
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">({{ linksByCategory[category.id]?.length || 0 }})</span>
              </div>
              
              <div class="category-links">
                <div
                  v-for="link in linksByCategory[category.id]"
                  :key="link.id"
                  class="link-row"
                >
                  <div class="link-info">
                    <div class="link-icon">
                      <span v-if="link.icon">{{ link.icon }}</span>
                      <div v-else class="default-icon">{{ link.title.charAt(0).toUpperCase() }}</div>
                    </div>
                    <div class="link-details">
                      <div class="link-title">{{ link.title }}</div>
                      <div class="link-url">{{ link.url }}</div>
                    </div>
                  </div>
                  
                  <div class="link-actions">
                    <button @click="openLinkForm(link)" class="edit-btn" title="编辑">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button @click="deleteLink(link.id)" class="delete-btn" title="删除">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分类管理 -->
        <div v-if="activeTab === 'categories'" class="tab-content">
          <div class="action-bar">
            <button @click="openCategoryForm()" class="add-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              添加分类
            </button>
          </div>
          
          <div class="categories-list">
            <div
              v-for="category in sortedCategories"
              :key="category.id"
              class="category-row"
            >
              <div class="category-info">
                <div class="category-icon-display">
                  <span>{{ category.icon }}</span>
                </div>
                <div class="category-details">
                  <div class="category-name">{{ category.name }}</div>
                  <div class="category-stats">{{ linksByCategory[category.id]?.length || 0 }} 个链接</div>
                </div>
              </div>
              
              <div class="category-actions">
                <button @click="openCategoryForm(category)" class="edit-btn" title="编辑">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
                <button @click="deleteCategory(category.id)" class="delete-btn" title="删除">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 链接表单 -->
    <div v-if="showLinkForm" class="form-overlay">
      <div class="form-content">
        <div class="form-header">
          <h3>{{ editingLink ? '编辑链接' : '添加链接' }}</h3>
          <button @click="closeLinkForm" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveLinkForm" class="link-form">
          <div class="form-group">
            <label>标题 *</label>
            <input v-model="linkForm.title" type="text" required placeholder="请输入链接标题">
          </div>
          
          <div class="form-group">
            <label>网址 *</label>
            <input v-model="linkForm.url" type="url" required placeholder="https://example.com">
          </div>
          
          <div class="form-group">
            <label>图标</label>
            <input v-model="linkForm.icon" type="text" placeholder="🔗 或留空使用首字母">
          </div>
          
          <div class="form-group">
            <label>描述</label>
            <input v-model="linkForm.description" type="text" placeholder="简短描述（可选）">
          </div>
          
          <div class="form-group">
            <label>分类 *</label>
            <select v-model="linkForm.categoryId" required>
              <option value="">请选择分类</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.icon }} {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeLinkForm" class="cancel-btn">取消</button>
            <button type="submit" class="save-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- 分类表单 -->
    <div v-if="showCategoryForm" class="form-overlay">
      <div class="form-content">
        <div class="form-header">
          <h3>{{ editingCategory ? '编辑分类' : '添加分类' }}</h3>
          <button @click="closeCategoryForm" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveCategoryForm" class="category-form">
          <div class="form-group">
            <label>分类名称 *</label>
            <input v-model="categoryForm.name" type="text" required placeholder="请输入分类名称">
          </div>
          
          <div class="form-group">
            <label>图标</label>
            <input v-model="categoryForm.icon" type="text" placeholder="📁 选择一个图标">
          </div>
          
          <div class="form-group">
            <label>颜色</label>
            <input v-model="categoryForm.color" type="color" class="color-input">
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeCategoryForm" class="cancel-btn">取消</button>
            <button type="submit" class="save-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps, defineEmits } from 'vue'
import { useQuickLinks, type QuickLink, type Category } from '../composables/useQuickLinks'

interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const {
  linksByCategory,
  categories,
  addQuickLink,
  updateQuickLink,
  deleteQuickLink,
  addCategory,
  updateCategory,
  deleteCategory: deleteCategoryFn
} = useQuickLinks()

const activeTab = ref<'links' | 'categories'>('links')
const showLinkForm = ref(false)
const showCategoryForm = ref(false)
const editingLink = ref<QuickLink | null>(null)
const editingCategory = ref<Category | null>(null)

// 表单数据
const linkForm = reactive({
  title: '',
  url: '',
  icon: '',
  description: '',
  categoryId: '',
  order: 0
})

const categoryForm = reactive({
  name: '',
  icon: '',
  color: '#007AFF',
  order: 0
})

// 排序后的分类
const sortedCategories = computed(() => {
  return [...categories].sort((a, b) => a.order - b.order)
})

// 关闭管理器
const closeManager = () => {
  emit('close')
}

// 链接表单操作
const openLinkForm = (link?: QuickLink) => {
  if (link) {
    editingLink.value = link
    Object.assign(linkForm, {
      title: link.title,
      url: link.url,
      icon: link.icon || '',
      description: link.description || '',
      categoryId: link.categoryId,
      order: link.order
    })
  } else {
    editingLink.value = null
    Object.assign(linkForm, {
      title: '',
      url: '',
      icon: '',
      description: '',
      categoryId: '',
      order: 0
    })
  }
  showLinkForm.value = true
}

const closeLinkForm = () => {
  showLinkForm.value = false
  editingLink.value = null
}

const saveLinkForm = () => {
  if (editingLink.value) {
    updateQuickLink(editingLink.value.id, {
      title: linkForm.title,
      url: linkForm.url,
      icon: linkForm.icon,
      description: linkForm.description,
      categoryId: linkForm.categoryId,
      order: linkForm.order
    })
  } else {
    addQuickLink({
      title: linkForm.title,
      url: linkForm.url,
      icon: linkForm.icon,
      description: linkForm.description,
      categoryId: linkForm.categoryId,
      order: linkForm.order
    })
  }
  closeLinkForm()
}

// 分类表单操作
const openCategoryForm = (category?: Category) => {
  if (category) {
    editingCategory.value = category
    Object.assign(categoryForm, {
      name: category.name,
      icon: category.icon || '',
      color: category.color || '#007AFF',
      order: category.order
    })
  } else {
    editingCategory.value = null
    Object.assign(categoryForm, {
      name: '',
      icon: '',
      color: '#007AFF',
      order: categories.length
    })
  }
  showCategoryForm.value = true
}

const closeCategoryForm = () => {
  showCategoryForm.value = false
  editingCategory.value = null
}

const saveCategoryForm = () => {
  if (editingCategory.value) {
    updateCategory(editingCategory.value.id, {
      name: categoryForm.name,
      icon: categoryForm.icon,
      color: categoryForm.color,
      order: categoryForm.order
    })
  } else {
    addCategory({
      name: categoryForm.name,
      icon: categoryForm.icon,
      color: categoryForm.color,
      order: categoryForm.order
    })
  }
  closeCategoryForm()
}

// 删除操作
const deleteLink = (id: string) => {
  if (confirm('确定要删除这个链接吗？')) {
    deleteQuickLink(id)
  }
}

const deleteCategory = (id: string) => {
  const linkCount = linksByCategory.value[id]?.length || 0
  if (linkCount > 0) {
    if (!confirm(`该分类下有 ${linkCount} 个链接，删除分类会同时删除所有链接，确定继续吗？`)) {
      return
    }
  } else {
    if (!confirm('确定要删除这个分类吗？')) {
      return
    }
  }
  deleteCategoryFn(id)
}
</script>

<style scoped>
.quicklinks-manager {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.quicklinks-manager.show {
  opacity: 1;
  visibility: visible;
}

.manager-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.manager-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.manager-header h2 {
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
  font-size: 20px;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.manager-tabs {
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.tab-btn.active {
  color: #007AFF;
  border-bottom-color: #007AFF;
}

.manager-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-btn {
  background: #007AFF;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: background 0.2s ease;
}

.add-btn:hover {
  background: #0056CC;
}

/* 链接列表 */
.category-group {
  margin-bottom: 24px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
}

.category-icon {
  font-size: 16px;
}

.category-count {
  color: #666;
  font-size: 14px;
}

.category-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.link-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.link-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  flex-shrink: 0;
}

.link-icon span {
  font-size: 14px;
}

.default-icon {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.link-details {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-url {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #666;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: rgba(0, 122, 255, 0.1);
  border-color: #007AFF;
  color: #007AFF;
}

.delete-btn:hover {
  background: rgba(255, 59, 48, 0.1);
  border-color: #FF3B30;
  color: #FF3B30;
}

/* 分类列表 */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.category-icon-display {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 20px;
}

.category-details {
  flex: 1;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.category-stats {
  font-size: 12px;
  color: #666;
}

.category-actions {
  display: flex;
  gap: 8px;
}

/* 表单样式 */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 4000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.form-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.link-form, .category-form {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-group input, .form-group select {
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-group input:focus, .form-group select:focus {
  border-color: #007AFF;
}

.color-input {
  width: 60px;
  height: 40px;
  padding: 4px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #666;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
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
@media (max-width: 768px) {
  .manager-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .manager-header,
  .manager-body,
  .form-header,
  .link-form,
  .category-form {
    padding: 16px 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style> 