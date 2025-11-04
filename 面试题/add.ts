

function createAdd(value = 0): any {
    return new Proxy({
        [Symbol.for('nodejs.util.inspect.custom')]() {
            return value
        }
    }, {
        get(target, key) {
            if (key === Symbol.toPrimitive) {
                return () => value
            }
            return createAdd(value + Number(key))
        }
    })
}

const add = createAdd()

const a = add[2][3][4]
const r1 = add[1][2][3] + 4 //10
const r2 = add[10][20] + 30 //60
console.log(a);
console.log(r1);
console.log(r2);


