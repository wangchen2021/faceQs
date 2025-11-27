// 被观察者（主题）
class Subject {
    constructor() {
        this.observers = [];
        this.state = null;
    }

    // 添加观察者
    attach(observer) {
        this.observers.push(observer);
    }

    // 移除观察者
    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // 通知所有观察者
    notify() {
        this.observers.forEach(observer => observer.update(this));
    }

    // 设置状态并通知
    setState(state) {
        this.state = state;
        this.notify();
    }

    // 获取状态
    getState() {
        return this.state;
    }
    
}

// 观察者
class Observer {
    constructor(name) {
        this.name = name;
    }

    // 必须实现的更新方法
    update(subject) {
        console.log(`${this.name} 收到通知，新状态：${subject.getState()}`);
    }
}

// 使用示例
const subject = new Subject();

// 创建观察者
const observer1 = new Observer('观察者A');
const observer2 = new Observer('观察者B');

// 注册观察者
subject.attach(observer1);
subject.attach(observer2);

// 改变状态，触发通知
subject.setState('状态1');
subject.setState('状态2');

// 移除一个观察者
subject.detach(observer1);
subject.setState('状态3');