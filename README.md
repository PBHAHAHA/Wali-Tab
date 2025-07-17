# 瓦砾Tab -- Wali-Tab

一个基于 Vue 3 + TypeScript + Vite 开发的现代化新标签页浏览器扩展，同时支持 Chrome 和 Firefox 浏览器。

## 功能特点

- 🔍 **智能搜索** - 支持多个搜索引擎（Google、百度、必应、GitHub）
- 🌐 **直接访问** - 输入网址可直接跳转
- 🔗 **快捷链接** - 可自定义的快捷链接管理，支持分类整理
- 🎨 **自定义背景** - 支持自定义背景图片
- ⚙️ **灵活设置** - 丰富的个性化设置选项
- 💾 **数据同步** - 自动保存用户设置和快捷链接
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🌍 **多浏览器支持** - 同时支持 Chrome 和 Firefox

## 技术栈

- **Vue 3** - 现代化的前端框架，使用 Composition API
- **TypeScript** - 类型安全的开发体验
- **Vite** - 快速的构建工具和开发服务器
- **Pinia** - 状态管理
- **VueUse** - Vue 组合式 API 工具集
- **Chrome Extension Manifest V3** - 最新的扩展标准
- **Firefox WebExtensions** - Firefox 扩展 API

## 开发环境

```bash
# 安装依赖
npm install
# 或使用 pnpm
pnpm install

# 开发模式（Chrome 版本）
npm run dev

# 构建生产版本
npm run build:chrome    # Chrome 版本
npm run build:firefox   # Firefox 版本
npm run build:all       # 构建所有版本

# 打包扩展文件
npm run build:package

# 使用便捷脚本
./build-all.sh          # Linux/macOS
build-all.bat           # Windows
```

## 安装使用

### Chrome 浏览器

1. 克隆或下载此项目
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build:chrome` 构建项目
4. 打开 Chrome 浏览器，进入扩展管理页面 (`chrome://extensions/`)
5. 开启"开发者模式"
6. 点击"加载已解压的扩展程序"
7. 选择项目的 `dist` 目录

### Firefox 浏览器

1. 构建 Firefox 版本：`npm run build:firefox`
2. 打开 Firefox，进入调试页面 (`about:debugging`)
3. 点击"此Firefox"
4. 点击"临时载入附加组件"
5. 选择 `dist-firefox` 目录中的 `manifest.json` 文件

## 项目结构

```
vue-quick-extension/
├── public/                    # 静态资源
│   ├── manifest.json         # Chrome 扩展配置
│   ├── manifest-firefox.json # Firefox 扩展配置
│   ├── icons/               # 扩展图标
│   └── imgs/                # 背景图片
├── src/
│   ├── newtab/              # 新标签页模块
│   │   ├── App.vue          # 主应用组件
│   │   ├── main.ts          # 入口文件
│   │   ├── components/      # Vue 组件
│   │   │   ├── QuickLinks.vue        # 快捷链接展示
│   │   │   ├── QuickLinksManager.vue # 快捷链接管理器
│   │   │   ├── SettingsPanel.vue     # 设置面板
│   │   │   └── SettingsButton.vue    # 设置按钮
│   │   └── composables/     # 组合式 API
│   │       ├── useSettings.ts       # 设置管理
│   │       └── useQuickLinks.ts     # 快捷链接管理
│   └── styles/              # 全局样式
├── scripts/                 # 构建脚本
│   ├── build-extension.js   # 扩展打包脚本
│   └── test-build.js        # 构建测试脚本
├── dist/                    # Chrome 构建输出
├── dist-firefox/            # Firefox 构建输出
├── packages/                # 打包后的扩展文件
├── newtab.html             # 新标签页 HTML 模板
├── vite.config.ts          # Chrome 构建配置
├── vite.config.firefox.ts  # Firefox 构建配置
├── build-all.sh            # 全平台构建脚本 (Unix)
├── build-all.bat           # 全平台构建脚本 (Windows)
└── package.json            # 项目配置
```

## 使用说明

### 搜索功能
1. **搜索引擎选择**：点击搜索框上方的按钮切换搜索引擎
2. **智能搜索**：输入关键词按回车进行搜索
3. **直接访问**：输入网址（包含.）会直接跳转到该网站
4. **设置保存**：您选择的搜索引擎会自动保存

### 快捷链接
1. **查看链接**：主界面下方显示快捷链接，按分类组织
2. **管理链接**：点击右上角设置按钮，选择"管理快捷链接"
3. **添加链接**：在管理器中可以添加、编辑、删除链接
4. **分类管理**：支持创建自定义分类，拖拽排序

### 个性化设置
1. **背景设置**：可以设置自定义背景图片
2. **显示选项**：可以选择是否显示快捷链接
3. **重置设置**：可以重置所有设置到默认状态

## 自定义开发

### 添加搜索引擎

在 `src/newtab/App.vue` 中找到 `searchEngines` 配置：

```typescript
const searchEngines = ref([
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: '百度', url: 'https://www.baidu.com/s?wd=' },
  { name: '必应', url: 'https://www.bing.com/search?q=' },
  { name: 'GitHub', url: 'https://github.com/search?q=' }
])
```

### 修改默认快捷链接

在 `src/newtab/composables/useQuickLinks.ts` 中修改 `defaultQuickLinks` 和 `defaultCategories` 数组。

### 更换默认背景图片

修改 `src/newtab/App.vue` 中的背景样式：

```css
.newtab-container {
  background-image: url('/imgs/your-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

## 开发指南

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 实时构建（监听文件变化）
npm run build:watch              # Chrome 版本
npm run build:firefox:watch      # Firefox 版本
```

### 代码规范

```bash
# ESLint 检查和修复
npm run lint
```

### 测试构建

```bash
# 测试构建配置
npm run test:build
```

## 构建和发布

### 开发版本
使用 `npm run build:all` 构建开发版本，生成的文件在 `dist/` 和 `dist-firefox/` 目录。

### 发布版本
使用 `npm run build:package` 生成可发布的打包文件，文件位于 `packages/` 目录：
- `wali-tab-chrome-v{version}.zip` - Chrome 应用商店版本
- `wali-tab-firefox-v{version}.zip` - Firefox 附加组件版本

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 这个项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request 