const father = {
    name: "father",
    age: 12
}

const son = Object.create(father, {
    say: {
        value: () => {
            console.log("我是son");
        },
        writable: true,
        enumerable: true
    },
})

console.log(son.say, son.age);
