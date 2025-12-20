import { lowPriorityTimeout, maxSigned31bitInt, normalPriorityTimeout, userBlockingPriorityTimeout } from "./SchedulerFeatureFlags"
import { peek, pop, push } from "./SchedulerMinHeap"
import { IdlePriority, ImmediatePriority, LowPriority, NoPriority, NormalPriority, PriorityLevel, UserBlockingPriority } from "./SchedulerPriorities"
import { getCurrentTime } from "@my-mini-react/shared"

export * from "./SchedulerPriorities.js"

export type Task = {
    id: number
    callback: Callback | null
    priorityLevel: PriorityLevel
    startTime: number
    expirationTime: number  //等待时间
    sortIndex: number
}

type Callback = (arg: boolean) => Callback | null | undefined

//普通任务
const taskQueue: Array<Task> = []
//延迟任务
const timerQueue: Array<Task> = []

let currentTask: Task | null = null
let currentPriorityLevel: PriorityLevel = NoPriority
let startTime = -1

let frameInterval = 5
let taskId = 0

//work是否执行
let isPerformingWork = false

//主线程是否被调度
let isHostCallbackScheduled = false

let isMessageLoopRunning = false

//是否有任务在倒计时
let isHostTimeoutScheduled = false

//延迟任务倒计时timerId
let taskTimeoutId = -1

function getTimeOut(priorityLevel: PriorityLevel) {
    let timeout = normalPriorityTimeout;
    switch (priorityLevel) {
        case ImmediatePriority:
            timeout = -1
            break;
        case UserBlockingPriority:
            timeout = userBlockingPriorityTimeout
            break
        case NormalPriority:
            timeout = normalPriorityTimeout
            break
        case IdlePriority:
            timeout = maxSigned31bitInt
            break
        case LowPriority:
            timeout = lowPriorityTimeout
            break
    }
    return timeout
}

//任务调度器的入口函数
export function scheduleCallback(priorityLevel: PriorityLevel, callback: Callback, options: { delay: number }) {
    const currentTime = getCurrentTime()
    let startTime = currentTime

    //延迟任务 修改开始时间
    if (options && options.delay) {
        let delay = options.delay
        if (typeof delay === "number" && delay > 0) {
            startTime = currentTime + delay
        }
    }

    const expirationTime = startTime + getTimeOut(priorityLevel)
    const newTask: Task = {
        id: taskId++,
        callback,
        priorityLevel,
        startTime,
        expirationTime,
        sortIndex: -1,
    }

    //延迟任务 修改sortIndex
    if (startTime > currentTime) {
        //在timerQueue到达时间时推到taskQueue
        newTask.sortIndex = startTime
        push(timerQueue, newTask)
        if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
            if (isHostTimeoutScheduled) {
                //newTask才是堆顶任务

            } else {

            }
        }
    } else {
        newTask.sortIndex = expirationTime
        push(taskQueue, newTask)
        if (!isHostCallbackScheduled && !isPerformingWork) {
            isHostCallbackScheduled = true
            requestHostCallback()
        }
    }
}

function requestHostCallback() {
    if (!isMessageLoopRunning) {
        isMessageLoopRunning = true
        schedulePerformWorkUntilDeadline()
    }
}


//方案1 setTimeout(fn, 0) 有 4ms 最小延迟（浏览器限制），无法做到 “立即异步执行”，调度精度低；
//方案2 requestIdleCallback 仅在浏览器空闲时执行，优先级极低，无法满足 React 同步更新（如用户输入）的高优先级需求
//方案3 微任务（Promise.then） 微任务会在当前宏任务结束后立即执行，阻塞浏览器的渲染 / 布局，无法 “交还主线程”，违背 React 时间切片（Time Slicing）的核心设计；
//为什么是 MessageChannel？

/**
需求点	MessageChannel 如何满足
异步执行，无最小延迟	宏任务类型，无 4ms 延迟，比 setTimeout 更即时
可中断执行（时间切片）	异步循环中可通过 shouldYieldToHost 主动交还主线程
不阻塞渲染 / 交互	宏任务特性，执行时机在浏览器渲染周期之后，微任务执行完成之后
跨浏览器一致性	所有现代浏览器支持，行为稳定，无兼容性陷阱
 */


const channel = new MessageChannel()
const { port1, port2 } = channel
port1.onmessage = performWorkUntilDeadline

function performWorkUntilDeadline() {
    if (isMessageLoopRunning) {
        const currentTime = getCurrentTime()
        startTime = currentTime
        let hasMoreWork = true
        try {
            hasMoreWork = flushWork(currentTime)
        } finally {
            if (hasMoreWork) {
                schedulePerformWorkUntilDeadline()
            } else {
                isMessageLoopRunning = false
            }
        }
    }
}

function flushWork(initialTime: number) {
    isHostCallbackScheduled = false
    isPerformingWork = true
    let previousPriorityLevel = currentPriorityLevel
    try {
        return workLook(initialTime)
    } finally {
        currentTask = null
        currentPriorityLevel = previousPriorityLevel
        isPerformingWork = false
    }
}

function schedulePerformWorkUntilDeadline() {
    port2.postMessage(null)
}

//暂时设置为null
export function cancelCallback(callback: Callback) {
    if (currentTask) {
        currentTask.callback = null
    }
}

export function getCurrentPriorityLevel(): PriorityLevel {
    return currentPriorityLevel
}

//有很多task 每个task callback执行完执行下一个
//返回true表示任务没执行完
function workLook(initialTime: number) {
    let currentTime = initialTime
    currentTask = peek(taskQueue)
    while (currentTask) {
        if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
            break
        }
        const { callback } = currentTask
        if (typeof callback === "function") {
            currentTask.callback = null
            currentPriorityLevel = currentTask.priorityLevel
            const didUserCallbackTimeout = currentTask.expirationTime <= currentTime
            const continuationCallback = callback(didUserCallbackTimeout)
            if (typeof continuationCallback === "function") {
                currentTask.callback = continuationCallback
                return true
            } else {
                if (currentTask === peek(taskQueue)) {
                    pop(taskQueue)
                }
            }
        } else {
            pop(taskQueue)
        }
        currentTask = peek(taskQueue)
    }
    if (currentTask !== null) {
        return true
    } else {
        return false
    }
}

function requestHostTimeout(callback: (currentTime: number) => void, ms: number) {
    taskTimeoutId = setTimeout(() => {
        callback(getCurrentTime())
    }, ms);
}

function cancelHostTimeout() {
    clearTimeout(taskTimeoutId)
    taskTimeoutId = -1
}

//何时交还主线程
export function shouldYieldToHost() {
    const timeElapsed = getCurrentTime() - startTime
    if (timeElapsed < frameInterval) {
        return false
    }
    return true
}