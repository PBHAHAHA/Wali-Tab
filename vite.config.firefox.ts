import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件：复制 Firefox manifest.json 到输出目录
    {
      name: 'copy-firefox-manifest',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: JSON.stringify(require('./public/manifest-firefox.json'), null, 2)
        })
      }
    }
  ],
  build: {
    outDir: 'dist-firefox',
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'newtab.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
}) 