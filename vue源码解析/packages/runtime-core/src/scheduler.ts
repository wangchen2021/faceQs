const queue: Function[] = [] //任务队列
let isFlushing = false //是否正在刷新
const resolvedPromise = Promise.resolve()
export function queueJob(job: Function) {
    if (!queue.includes(job)) { //多次更新状态任务去重
        queue.push(job)
    }
    if (!isFlushing) {
        isFlushing = true
        resolvedPromise.then(() => { //异步更新
            isFlushing = false
            const copy = queue.slice(0)
            queue.length = 0
            copy.forEach((job) => job())
            copy.length = 0
        })
    }
}