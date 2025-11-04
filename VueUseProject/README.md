## 个人框架学习

# vite文档
https://vitejs.cn/vite3-cn/guide/
https://vitejs.cn/vite6-cn/config/

# vue文档

1. 自动注入less变量

  css:{
    preprocessorOptions:{
      less:{
        additionalData:`@import "@/style/var.less";`
      }
    }
  }



2. 依赖安装

-D ===  --save-dev
表示只有在开发/构建阶段需要 不要带到生产环境

-O ===  --save-optional 可选 安装失败也不打断cli

--global === -g  全局安装

-P  --save-prod 业务运行时的必要包


3. 路径别名

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },

