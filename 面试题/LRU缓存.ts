// 要求：实现一个 LRU (最近最少使用) 缓存，支持 get 和 put 方法
class LRUCache {
    keys = new Set()
    cache = new Map()
    capacity!: number
    constructor(capacity: number) {
        // 你的代码
        this.capacity = capacity
    }

    get(key: any | symbol) {
        // 你的代码
        if (!this.cache.has(key)) {
            return -1
        } else {
            this.keys.delete(key)
            this.keys.add(key)
            return this.cache.get(key)
        }
    }

    put(key: any, value: any) {
        // 你的代码
        if (this.cache.has(key)) {
            this.cache.set(key, value)
            this.keys.delete(key)
            this.keys.add(key)
        } else {
            if (this.keys.size === this.capacity) {
                const firstKey = this.keys.values().next().value
                this.keys.delete(firstKey)
                this.cache.delete(firstKey)
            }
            this.keys.add(key)
            this.cache.set(key, value)
        }
    }
}


// 测试用例
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3); // 驱逐 key 2
console.log(cache.get(2)); // -1
cache.put(4, 4); // 驱逐 key 1
console.log(cache.get(1)); // -1
console.log(cache.get(3)); // 3
console.log(cache.get(4)); // 4
