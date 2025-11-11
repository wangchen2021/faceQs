import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import postcssPxToViewport from 'postcss-px-to-viewport';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssPxToViewport({
          // 1. 设计稿宽度（根据你的设计稿填写，通常为 375px 或 750px）
          viewportWidth: 1920,
          // 2. 需要转换的单位（默认 px）
          unitToConvert: 'px',
          // 3. 转换后保留的小数位数
          unitPrecision: 5,
          // 4. 需要转换的 CSS 属性（* 表示所有）
          propList: ['*'],
          // 5. 转换后的单位（使用 vw）
          viewportUnit: 'vw',
          // 6. 字体转换后的单位（也使用 vw）
          fontViewportUnit: 'vw',
          // 7. 类名中包含以下前缀则不转换（如 .ignore-xxx）
          selectorBlackList: ['ignore-'],
          // 8. 小于等于 1px 的值不转换
          minPixelValue: 1,
          // 9. 是否在媒体查询中转换 px（默认 false）
          mediaQuery: true,
          // 10. 是否直接替换原属性，而非添加备用属性
          replace: true,
          // 11. 排除 node_modules 目录（避免第三方组件被转换）
          exclude: [/node_modules/],
          // 12. 是否处理横屏（可选）
          landscape: false,
        }),
      ]
    }
  }
})
