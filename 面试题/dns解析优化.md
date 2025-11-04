## dns解析优化

1. 将需要用到的dns提前放在link标签里
`<link ref="dns-prefetch"  href="{{dns_url}}"></link> `

2. 分析打包结果
遍历生成的html js css文件 将url集中在一共set里面 最终通过在html里插入link标签完成