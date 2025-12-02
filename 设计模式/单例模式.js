class Dog {

    constructor(name) {
        this.name = name
    }

    static getInstance(...args) {
        if (!Dog.instance) {
            Dog.instance = new Dog(...args)
        }
        return Dog.instance
    }

}

const dog1 = Dog.getInstance("dog1")
const dog2 = Dog.getInstance("dog2")

console.log(dog1 === dog2, dog1, dog2);

const SingleDog = new Proxy(Dog, {

    construct(target, args, newTarget) {
        if (!target.instance) {
            target.instance = Reflect.construct(target, args, newTarget)
        }
        return target.instance
    }

})

const dog3 = new SingleDog("dog3")
const dog4 = new SingleDog("dog4")

console.log(dog3 === dog4, dog3, dog4);
