## vue源码解析

1. 官方文档
https://cn.vuejs.org/guide/quick-start.html

2. 视频教程
https://www.bilibili.com/video/BV1zBc2e4EaZ/?p=15&spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=2e335378575371c0ee42c4dc7ddc2978


## vue编译优化

1. 靶向更新 patchFlag Block BlockTree
2. 静态变量提升，多次直接使用
3. 如果超过20个静态子节点 直接创建字符串保存静态节点
4. 缓存事件


## 编译原理
1. 将模板转换为ast抽象语法树
2. 对树进行优化 打标记
3. 根据转换后的代码生成字符串
- ast explore https://www.astexplorer.net/

<!-- 45 44 43 42 41 47 48 49 46 50 -->