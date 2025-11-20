function deepClone(target){
    let res=undefined
    const objectFlag="[object Object]"
    const arrayFlag="[object Array]"
    const type=Object.prototype.toString.call(target)
    if(type===objectFlag){
        res={}
    }else if(type === arrayFlag){
        res=[]
    }else{
        return target
    }
    for(let key in target){
        const value=target[key]
        const valueType=Object.prototype.toString.call(value)
        if(valueType===objectFlag||valueType===arrayFlag){
            res[key]=deepClone(value)
        }else{
            res[key]=value
        }
    }
    return res
}

let a={
    name:"a",
    age:1
}

let b=deepClone(a)

b.name="b"

console.log(a,b);
