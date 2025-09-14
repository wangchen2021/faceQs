function arrange(name) {
    let tasks = [() => console.log(`${name} is notified`)]

    const waitFunction = (time) => {
        return new Promise((resolve, _reject) => {
            setTimeout(() => {
                resolve()
            }, time);
        })
    }

    const prop = {
        wait: (time) => {
            tasks.push(() => waitFunction(time * 1000))
            return prop
        },
        do: (fn) => {
            tasks.push(fn)
            return prop
        },
        waitFirst: (time) => {
            tasks.unshift(() => waitFunction(time * 1000))
            return prop
        },
        execute: async () => {
            for (let item of tasks) {
                await item()
                tasks.pop()
            }
        }
    }
    return prop
}

arrange("William")
    .wait(5)
    .do(() => {
        console.log("commit");
    })
    .wait(2)
    .do(() => {
        console.log("我又等2s");
    })
    .waitFirst(3)
    .execute()
// wait 3s
// William
// wait 5s
// commit