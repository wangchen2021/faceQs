// /**
//  * @param {string} s
//  * @return {boolean}
//  */
// var isValid = function(s) {
//     const map = {
//         "{": "}",
//         "(": ")",
//         "[": "]"
//     }
//     const len=s.length
//     const buffer=[]
//     for(let i=0;i<len;i++){
//         const target=s.charAt(i)
//         const mapValue=map[target]
//         if(mapValue){
//            buffer.push(target)
//         }else{
//           if(mapValue!==map[buffer.pop()]) return false
//         }
//     }
//     if(buffer.length>0) return false
//     return true
// };

// console.log(isValid("()"));

const fn = new Function("console.log(1111)")
fn()
