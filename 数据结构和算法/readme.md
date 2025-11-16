# 数据结构和算法
https://www.bilibili.com/video/BV1Fv4y1f7T1/?spm_id_from=333.337.search-card.all.click&vd_source=2e335378575371c0ee42c4dc7ddc2978

## ADT
- abstract data types  抽象数据类型

## List(Array)

- insert 可以插入元素 O(n)
- remove 移除元素 O(n)
- expend 自动扩展 每次2倍 O(n)
- add O(n)

特别注意：
JavaScript 数组的本质：并非真正的 “数组”
在传统编程语言（如 C、Java）中，数组是连续的内存空间，长度固定，声明时必须指定大小，且不能直接修改长度（如需扩容需手动复制到新的更大空间）。
但 JavaScript 的数组本质上是一种特殊的对象（typeof [] === 'object'），它的 “索引” 其实是对象的属性名（只不过是数字形式），而数组的 “长度”（length）是一个动态维护的属性。

```javascript
{
    index:value,
    ...n-1...
    length:n
}
```


## LinkList

- data
- next

```javascript
const listNode={
    data:data,
    next:nextNodeLink
}
```