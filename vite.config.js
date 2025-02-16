import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-static-assets',
      apply: 'build',
      enforce: 'post',
      closeBundle() {
        // 复制manifest.json
        fs.copyFileSync(
          path.resolve(__dirname, 'manifest.json'),
          path.resolve(__dirname, 'dist/manifest.json')
        )

        // 复制图标文件夹（如果存在）
        const iconsSrcPath = path.resolve(__dirname, 'icons')
        if (fs.existsSync(iconsSrcPath)) {
          const copyDir = (src, dest) => {
            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true })
            }
            const files = fs.readdirSync(src)
            for (const file of files) {
              const srcPath = path.join(src, file)
              const destPath = path.join(dest, file)
              if (fs.statSync(srcPath).isDirectory()) {
                copyDir(srcPath, destPath)
              } else {
                fs.copyFileSync(srcPath, destPath)
              }
            }
          }
          copyDir(
            iconsSrcPath,
            path.resolve(__dirname, 'dist/icons')
          )
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/plugin-vue-helper.[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 禁用代码分割
    cssCodeSplit: false,
    sourcemap: false,
    // 确保资源的正确引用
    assetsDir: '.',
    // 禁用压缩以便于调试
    minify: false
  },
  server: {
    port: 3000
  },
  base: './'
})