class EventEmitter {

    constructor() {
        this.tasks = new Map()
    }

    on(name, callback, context, once = false) {
        if (!this.tasks.has(name)) {
            this.tasks.set(name, [])
        }
        const callbacks = this.tasks.get(name)
        callbacks.push({
            callback,
            context,
            once
        })
        return this
    }

    emit(name, ...args) {
        if (this.tasks.has(name)) {
            const callbacks = [...this.tasks.get(name)];
            callbacks.forEach(callbackItem => {
                const { callback, context, once } = callbackItem
                callback.apply(context, [...args])
                if (once) {
                    this.off(name, callback)
                }
            });
        }
        return this
    }

    off(name, callback) {
        if (this.tasks.has(name)) {
            const callbacks = this.tasks.get(name)
            const newCallBacks = callbacks.filter((item) => {
                return item.callback !== callback
            })
            if (newCallBacks.length === 0) {
                this.tasks.delete(name)
            } else {
                this.tasks.set(name, newCallBacks)
            }
        }
        return this
    }

    once(name, callback, context) {
        this.on(name, callback, context, true)
        return this
    }

}

const emitter = new EventEmitter()

function f1(str1, str2) {
    console.log("f1" + " " + str1 + " " + str2);
}

emitter.once("task1", f1)
emitter.emit("task1", "param1", "param2")
// emitter.off("task1", f1)
emitter.emit("task1", "param3", "param4")