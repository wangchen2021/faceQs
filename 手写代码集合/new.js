function myNew(constructor, ...args) {
    const obj = Object.create(constructor.prototype)
    const res = constructor.apply(obj, args)
    return (typeof res === "object" && res !== null) ? res : obj
}

function Dog(name) {
    this.name = name
    this.say = () => {
        console.log(this.name);
    }
    return {
        name: "123",
        say() {
            console.log(this.name);
        }
    }
}

const dog = myNew(Dog, "asd")
dog.say()