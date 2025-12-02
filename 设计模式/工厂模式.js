const Animal = {
    create(type) {
        switch (type) {
            case "cat":
                return new Cat()
            case "dog":
                return new Dog()
        }
    }
}

class Cat {
    constructor() {
        
    }
}

class Dog {
    constructor() {

    }
}

const dog = Animal.create("dog")

console.log(dog);
