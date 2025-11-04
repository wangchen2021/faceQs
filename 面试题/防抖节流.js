export { }

// 原理是维护一个定时器，将很多个相同的操作合并成一个。规定在delay后触发函数，
// 如果在此之前触发函数，则取消之前的计时重新计时，只有最后一次操作能被触发。例如：实时搜索的input，一直输入就不发送。

function fangdou(fn, delay = 3000) {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay);
    }
}

// 原理是判断是否达到一定的时间来触发事件。某个时间段内只能触发一次函数。例如：在指定的时间内多次触发无效

function jieliu(fn, interval = 3000) {
    let lastTime = 0
    return function (...args) {
        const now = Date.now()
        if (now - lastTime >= interval) {
            fn.apply(this, args)
            lastTime = now
        }
    }
}


function myfangdou(fn, delay) {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

function myJieLiu(fn, delay) {
    let lastTime = 0
    return function (...args) {
        const now = Date.now()
        if (now - currentTime > delay) {
            fn.apply(this, args)
            lastTime = now
        }
    }
}