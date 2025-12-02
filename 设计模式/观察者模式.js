class Observer {
    constructor(name) {
        this.name = name
    }
    update(message) {
        console.log("update:" + message);
    }
}


class Subject {
    constructor() {
        this.observers = []
    }

    addObserve(observer) {
        this.observers.push(observer)
    }

    removeObserver(observer) {
        this.observers = this.observers.filter((item) => {
            return item != observer
        })
    }

    notify(message) {
        this.observers.forEach(observer => {
            observer.update(message)
        })
    }
}