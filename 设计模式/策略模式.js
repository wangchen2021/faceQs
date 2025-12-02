//避免复杂的if else

const type = "dog"

function judgeType() {
    if (type === "dog") {
        console.log("fun1...");
    } else if (type === "people") {
        console.log("fun2...");
    }
}

const judgeTypeRule = {
    dog: () => console.log("fun1..."),
    people: () => console.log("fun2..."),
}

judgeTypeRule[type]()