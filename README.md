# Vue 新标签页扩展

一个基于 Vue 3 + TypeScript + Vite 开发的简洁新标签页浏览器扩展。

## 功能特点

- 🔍 **智能搜索** - 支持多个搜索引擎（Google、百度、必应、GitHub）
- 🌐 **直接访问** - 输入网址可直接跳转
- 🎨 **简约设计** - 清爽的界面，美丽的背景图片
- 💾 **设置记忆** - 自动保存用户的搜索引擎偏好
- 📱 **响应式** - 支持各种屏幕尺寸

## 技术栈

- **Vue 3** - 现代化的前端框架
- **TypeScript** - 类型安全的开发体验
- **Vite** - 快速的构建工具
- **Chrome Extension Manifest V3** - 最新的扩展标准

## 开发环境

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 或使用构建脚本
build-fix.bat
```

## 安装使用

1. 克隆或下载此项目
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build` 构建项目
4. 打开 Chrome 浏览器，进入扩展管理页面 (`chrome://extensions/`)
5. 开启"开发者模式"
6. 点击"加载已解压的扩展程序"
7. 选择项目的 `dist` 目录

## 项目结构

```
vue-quick-extension/
├── public/
│   └── manifest.json          # 扩展配置文件
├── src/
│   ├── newtab/               # 新标签页
│   │   ├── App.vue          # 主组件
│   │   └── main.ts          # 入口文件
│   └── styles/              # 全局样式
├── newtab.html              # 新标签页HTML
├── vite.config.ts           # Vite配置
├── build-fix.bat           # 构建脚本
└── package.json            # 项目配置
```

## 使用说明

1. **搜索引擎选择**：点击搜索框上方的按钮切换搜索引擎
2. **智能搜索**：输入关键词按回车进行搜索
3. **直接访问**：输入网址（包含.）会直接跳转到该网站
4. **设置保存**：您选择的搜索引擎会自动保存

## 自定义

- **更换背景图片**：修改 `src/newtab/App.vue` 中的背景图片URL
- **添加搜索引擎**：在 `searchEngines` 数组中添加新的搜索引擎配置
- **调整样式**：修改组件中的CSS样式

## 开发指南

### 修改搜索引擎

在 `src/newtab/App.vue` 中找到 `searchEngines` 配置：

```javascript
const searchEngines = ref([
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: '百度', url: 'https://www.baidu.com/s?wd=' },
  { name: '必应', url: 'https://www.bing.com/search?q=' },
  { name: 'GitHub', url: 'https://github.com/search?q=' }
])
```

### 更换背景图片

修改CSS中的背景图片URL：

```css
.newtab-container {
  background: url('YOUR_IMAGE_URL') center/cover no-repeat;
}
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！ 