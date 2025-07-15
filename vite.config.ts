import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件来处理manifest.json和其他静态文件
    {
      name: 'copy-extension-files',
      generateBundle() {
        // 复制manifest.json
        const manifestSrc = resolve(__dirname, 'public/manifest.json')
        const manifestDest = resolve(__dirname, 'dist/manifest.json')
        if (existsSync(manifestSrc)) {
          copyFileSync(manifestSrc, manifestDest)
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        content: resolve(__dirname, 'src/content/main.ts'),
        background: resolve(__dirname, 'src/background/main.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          const facadeModuleId = chunk.facadeModuleId
          if (facadeModuleId?.includes('content')) {
            return 'content.js'
          }
          if (facadeModuleId?.includes('background')) {
            return 'background.js'
          }
          if (facadeModuleId?.includes('options')) {
            return 'options.js'
          }
          return '[name].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  }
}) 