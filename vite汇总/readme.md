## Vite汇总
https://blog.csdn.net/weixin_47964837/article/details/126681481?spm=1001.2014.3001.5501

1. webpack和vite的区别
一个兼容性更强，一个更加快捷。

- 打包
webpack是采用静态模块打包机制，通过入口文件分析所有依赖关系，生成整体依赖图并全量打包为bundle文件
vite他利用了浏览器对于es的支持，他会拦截HTTP请求，根据需求按需打包。

- 热更新
Webpack采用全量更新，修改单个文件也会触发整体重建。‌‌
Vite实现增量更新，仅重新编译改动模块并局部刷新页面。‌‌

- 配置上
Webpack需编写webpack.config.js定义loader、plugin等，配置项多达数百个。‌‌
Vite默认集成TypeScript、CSS预处理器等，80%常用功能无需额外配置。‌‌



## vite新版 rollup
rolldown-vite 是 Vite 官方正在验证的“Rust 版打包核心”技术预览包，把 Vite 生产环境原本的 Rollup + Babel/Terser 整条 JavaScript 工具链，一次性替换为 Rust 编写的 Rolldown + Oxc，从而在不改配置的情况下获得 3–16 倍构建提速和近 100 倍内存降幅