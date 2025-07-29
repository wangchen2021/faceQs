1. `import`导出值的引用关系：
javascript
Copy Code
// module.js
export let counter = 0



// main.js
import { counter } from './module.js'
counter++ // 修改会同步到源模块



2. `require`导入值的拷贝特性（基本类型深拷贝/对象浅拷贝）：
javascript
Copy Code
// module.js
let count = 0
module.exports = { count }



// main.js
const mod = require('./module')
mod.count++ // 不影响源模块的count值