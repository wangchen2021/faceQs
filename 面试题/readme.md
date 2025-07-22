# 面试题地址：
https://blog.csdn.net/sun_qqq/article/details/128944976

1. 重绘和重排（回流/重构/重载）是什么？如何优化？
样式的调整会引起重绘，比如字体颜色、背景色调整等
Dom的变动会引起重排，比如定位改动、元素宽高调整

2. html5有哪些新特性？
本地存储，比如localStorage、sessionStorage
语义化标签，如header、footer、nav等，使代码结构清晰，利于seo
canvas
svg
web worker，在主线程外再创建一个线程，可与主线程交互
拖放功能

3. url输入后发生了什么
https://blog.csdn.net/lichunericli/article/details/140582342

-  内容判断
• 如果是普通的字符，那浏览器会使用默认的搜索引擎去对于输入的xxx生成URL。
• 如若输入的是网址，那浏览器会拼接协议名形成完整的URL。

- 本地缓存解析
是否有本地缓存以及是否过期

- dns域名解析
- TCP握手
- TLS握手（HTTPS）
- HTTP请求发送
- HTTP响应处理
- 浏览器渲染流程
# 解析HTML
DOM树构建：通过词法分析生成解析树
预加载扫描器：并行发现CSS/JS等资源
回流(Reflow)：计算布局信息

# CSS处理
CSSOM构建：级联规则处理
渲染树合并：DOM+CSSOM
图层合成：触发GPU加速

# JavaScript执行
解析阻塞：遇到<script>会暂停HTML解析
事件循环：宏任务/微任务处理机制
Web API：DOM/BOM等接口调用
