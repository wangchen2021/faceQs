// 要求：实现一个事件总线，支持 on、off、emit 方法
class EventBus {
    buffer: { [key: string | symbol]: Function[] } = {}

    constructor() { }

    on(event: string | symbol, callback: Function) {
        if (!this.buffer[event]) {
            this.buffer[event] = []
        }
        this.buffer[event].push(callback)
    }

    off(event: string | symbol, callback: Function) {
        if (this.buffer[event]) {
            this.buffer[event] = this.buffer[event].filter(fn => fn !== callback)
        }
    }

    emit(event: string | symbol, ...args: any[]) {
        const callbacks = this.buffer[event]
        if (callbacks && callbacks.length > 0) {
            for (let callback of callbacks) {
                callback.call(this, ...args);
            }
        }
    }
}

// 测试用例
const eventBus = new EventBus();
eventBus.on('test', (data: any) => console.log('test event:', data));
eventBus.emit('test', 'hello'); // 输出: test event: hello