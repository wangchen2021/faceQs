// class Student {
//     private name: string = ''
//     constructor(name: string) {
//         this.name = name
//     }
//     setName(name: string) {
//         this.name = name
//     }
//     getName() {
//         return this.name
//     }
// }

// class Dog {
//     constructor() { }
// }

// type singleInstanceType<T extends abstract new (...args: any[]) => any> = T & { instance?: InstanceType<T> }

// const singleInstance = <T extends abstract new (...args: any) => any>(classType: T): singleInstanceType<T> => {
//     return new Proxy(classType, {
//         construct(target: any, argsList: any[], newTarget?: any) {
//             if (!target.instance) {
//                 target.instance = Reflect.construct(target, argsList, newTarget)
//             }
//             return target.instance
//         }
//     }) as singleInstanceType<T>
// }

// const SingleStudent = singleInstance(Student)
// const SingleDog = singleInstance(Dog)

// let s1 = new SingleStudent('张三')
// let s2 = new SingleStudent('李四')
// let d1 = new SingleDog()
// let d2 = new SingleDog()
// let s3 = new Student('王五')

// // console.log(s1.name);
// console.log(d1 === d2);



class Test {
    constructor() {

    }
}

type SingleInstanceType<T extends abstract new (...args: any[]) => any> = T & { instance: T }

const SingleInstance = <T extends abstract new (...args: any[]) => any>(className: T):SingleInstanceType<T> => {
    return new Proxy(className, {
        construct(target:any, args, newTarget) {
            if (!target.instance) {
                target.instance = Reflect.construct(target, args, newTarget)
            }
            return target.instance
        },
    }) as SingleInstanceType<T>
}

const SingleTest = SingleInstance(Test)


const t1 = new Test()
const t2 = new Test()
console.log(t1 === t2);
const t3 = new SingleTest()
const t4 = new SingleTest()
console.log(t3 === t4);