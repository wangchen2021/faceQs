class Dog {
    type = "dog"
    constructor(name) {
        this.name = name
    }
    play() {

    }
}

class Bird {
    type = "bird"
    constructor(name) {
        this.name = name
    }
    fly() {

    }
}

class Cat {
    type = "cat"
    constructor(name) {
        this.name = name
    }
    eat() {

    }
}


class AnimalFactory {
    static createAnimal(type, name) {
        switch (type) {
            case "dog":
                return new Dog(name)
            case "bird":
                return new Bird(name)
            case "cat":
                return new Cat(name)
            default:
                throw TypeError("无效类型")
        }
    }
}

console.log(AnimalFactory.createAnimal("dog", "55"));
