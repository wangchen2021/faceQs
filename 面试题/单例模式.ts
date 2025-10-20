class Student {
    private name: string = ''
    constructor(name: string) {
        this.name = name
    }
    setName(name: string) {
        this.name = name
    }
    getName() {
        return this.name
    }
}

class Dog {
    constructor() { }
}

type singleInstanceType<T extends abstract new (...args: any[]) => any> = T & { instance?: InstanceType<T> }

const singleInstance = <T extends abstract new (...args: any) => any>(classType: T): singleInstanceType<T> => {
    return new Proxy(classType, {
        construct(target: any, argsList: any[], newTarget?: any) {
            if (!target.instance) {
                target.instance = Reflect.construct(target, argsList, newTarget)
            }
            return target.instance
        }
    }) as singleInstanceType<T>
}

const SingleStudent = singleInstance(Student)
const SingleDog = singleInstance(Dog)

let s1 = new SingleStudent('张三')
let s2 = new SingleStudent('李四')
let d1 = new SingleDog()
let d2 = new SingleDog()
let s3 = new Student('王五')

// console.log(s1.name);
console.log(d1 === d2);

