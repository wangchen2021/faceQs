function Person() {
    this.name = "person"
}

Person.prototype.say = function () {
    console.log(this.name)
}

const person1 = new Person()

person1.say()

function Child() {
    this.name = 'child'
}


//原型直接继承
Child.prototype = Object.create(Person.prototype)

const child1 = new Child()
child1.say()

