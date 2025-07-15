# Vue Quick Extension

基于 Vue 3 + TypeScript + Vite 的现代化浏览器插件开发脚手架

## 🚀 功能特性

- ⚡️ **Vue 3** - 使用最新的 Vue 3 Composition API
- 🏷️ **TypeScript** - 完整的类型支持
- 📦 **Vite** - 极速的构建工具和热重载
- 🎨 **现代化UI** - 精美的渐变设计和动画效果
- 🔧 **完整配置** - 开箱即用的开发环境
- 📱 **响应式设计** - 适配不同尺寸的弹出窗口
- 🛠️ **开发工具** - ESLint + 热重载支持

## 📁 项目结构

```
vue-quick-extension/
├── public/
│   ├── manifest.json          # 插件配置文件
│   └── icons/                 # 插件图标文件夹
├── src/
│   ├── popup/                 # 弹出窗口
│   │   ├── main.ts           # 弹出窗口入口
│   │   └── App.vue           # 弹出窗口主组件
│   ├── options/               # 选项页面
│   │   ├── main.ts           # 选项页面入口
│   │   └── App.vue           # 选项页面主组件
│   ├── content/               # 内容脚本
│   │   └── main.ts           # 内容脚本入口
│   ├── background/            # 背景脚本
│   │   └── main.ts           # 背景脚本入口
│   └── styles/                # 全局样式
│       └── global.css        # 全局样式文件
├── popup.html                 # 弹出窗口HTML
├── options.html               # 选项页面HTML
├── package.json              # 项目依赖配置
├── vite.config.ts            # Vite构建配置
├── tsconfig.json             # TypeScript配置
└── env.d.ts                  # 类型声明文件
```

## 🛠️ 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

**Windows用户的构建修复方案：**

如果遇到"无法加载选项页"的错误，请使用以下方法：

1. **使用修复脚本**（推荐）：
   ```bash
   build-fix.bat
   ```

2. **手动修复**：
   - 运行 `npm run build`
   - 复制 `options.html` 到 `dist` 目录
   - 编辑 `dist/options.html`，将 `src="/src/options/main.ts"` 改为 `src="options.js"`

### 监视模式构建

```bash
npm run build:watch
```

### 代码检查

```bash
npm run lint
```

## 📦 安装插件

1. 执行 `npm run build` 构建项目
2. 打开浏览器的扩展程序页面
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 文件夹

## 🎯 主要组件说明

### Popup（弹出窗口）
- 位置：`src/popup/`
- 功能：用户点击插件图标时显示的界面
- 特点：Vue 3 组件，支持与背景脚本和内容脚本通信

### Options（选项页面）
- 位置：`src/options/`
- 功能：插件的设置配置页面
- 特点：完整的Vue 3应用，支持设置保存、导出、统计等功能

### Content Script（内容脚本）
- 位置：`src/content/`
- 功能：注入到网页中运行的脚本
- 特点：可以访问和修改网页DOM，显示通知和悬浮按钮

### Background Script（背景脚本）
- 位置：`src/background/`
- 功能：插件的后台服务，处理事件和消息
- 特点：Service Worker模式，支持数据存储和标签页管理

## 🔧 自定义配置

### 修改插件信息
编辑 `public/manifest.json` 文件：
```json
{
  "name": "你的插件名称",
  "description": "你的插件描述",
  "version": "1.0.0"
}
```

### 添加权限
在 `manifest.json` 的 `permissions` 数组中添加所需权限：
```json
{
  "permissions": [
    "activeTab",
    "storage",
    "scripting",
    "tabs"
  ]
}
```

### 修改内容脚本匹配规则
在 `manifest.json` 中修改 `content_scripts` 的 `matches`：
```json
{
  "content_scripts": [
    {
      "matches": ["https://example.com/*"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ]
}
```

## 🎨 样式定制

### 全局样式
编辑 `src/styles/global.css` 修改全局样式和工具类

### 弹出窗口样式
在 `src/popup/App.vue` 的 `<style>` 部分修改弹出窗口样式

### 内容脚本样式
编辑 `src/content/content.css` 修改注入网页的样式

## 📚 开发技巧

### 消息通信
```typescript
// 从popup发送消息到content script
chrome.tabs.sendMessage(tabId, { type: 'HELLO', data: 'world' })

// 从content script发送消息到background
chrome.runtime.sendMessage({ type: 'GET_DATA', key: 'settings' })

// 监听消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 处理消息
})
```

### 数据存储
```typescript
// 存储数据
chrome.storage.sync.set({ key: 'value' })

// 获取数据
const result = await chrome.storage.sync.get('key')
```

### 热重载开发
开发时运行 `npm run build:watch`，修改代码后自动重新构建，然后在浏览器扩展页面点击刷新按钮即可看到更新。

## 🐛 常见问题

### TypeScript 类型错误
确保安装了 `@types/chrome` 依赖，并在 `tsconfig.json` 中包含了 `"chrome"` 类型。

### 热重载不工作
1. 确保运行的是 `npm run build:watch`
2. 修改代码后需要在浏览器扩展页面手动刷新插件
3. 某些更改（如manifest.json）需要重新加载整个插件

### 选项页面无法打开
如果点击"设置选项"按钮出现错误，请尝试以下解决方案：

1. **检查构建文件**：确保 `dist` 目录中存在 `options.html` 文件
2. **查看控制台**：右键点击弹出窗口 → 检查 → 控制台，查看详细错误信息
3. **手动打开**：在浏览器中直接访问 `chrome-extension://[插件ID]/options.html`
4. **重新构建**：运行 `npm run build` 重新构建插件
5. **重新加载插件**：在扩展管理页面刷新插件

### 样式不生效
1. 检查CSS选择器是否正确
2. 内容脚本样式通过JavaScript动态注入，无需单独的CSS文件
3. 如果样式被网页样式覆盖，可以提高CSS优先级或使用 `!important`

### 构建错误
1. 确保所有依赖都已正确安装：`npm install`
2. 如果遇到"无法为脚本加载重叠样式表"错误，这通常是因为CSS文件路径问题
3. 本脚手架已将内容脚本样式改为JavaScript动态注入，避免了CSS文件路径问题

### 插件无法加载
1. 检查 `manifest.json` 中的文件路径是否正确
2. 确保所有引用的文件都存在于 `dist` 目录中
3. 检查浏览器控制台是否有错误信息

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**开始你的浏览器插件开发之旅吧！** 🚀 