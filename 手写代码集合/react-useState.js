// let state = [];
// let index = 0;

// function useState(initialValue) {
//   const currentIndex = index;
//   state[currentIndex] = state[currentIndex] ?? initialValue;

//   const setState = (newValue) => {
//     if (typeof newValue === 'function') {
//       state[currentIndex] = newValue(state[currentIndex]);
//     } else {
//       state[currentIndex] = newValue;
//     }
//     render(); // 模拟重新渲染
//   };

//   index++;
//   return [state[currentIndex], setState];
// }

// // 模拟渲染
// function render() {
//   index = 0; // 重置索引
//   console.log('组件重新渲染');
// }





let index = 0
let state = []

function useState(initVal) {
    let currentIndex = index
    state[currentIndex] = state[currentIndex] ?? initVal

    function setState(newValue) {
        if (typeof newValue === "function") {
            return newValue(state[currentIndex])
        } else {
            state[currentIndex] = newValue
        }
        render()
    }

    index++
    return [state[currentIndex], setState]
}

function render() {
    console.log("重新渲染组件");
    index = 0
}



// let index = 0
// let state = []

// function useState(initVal) {
//     let currentIndex = index
//     state[currentIndex] = state[currentIndex] ? state[currentIndex] : initVal
//     function setState(newVal) {
//         if (typeof newVal === "function") {
//             state[currentIndex] = newVal(state[currentIndex])
//         } else {
//             state[currentIndex] = newVal
//         }
//         render()
//     }
//     index++
//     return [state[currentIndex], setState]
// }

// function render() {
//     console.log("update Component");
//     index = 0
// }

// function component() {
//     // 测试：
//     const [count, setCount] = useState(0);
//     console.log(count);
//     setCount(1); // 组件重新渲染
//     console.log(count);
//     // const [name, setName] = useState('React');
//     // setName('Vue'); // 组件重新渲染
// }

// component()