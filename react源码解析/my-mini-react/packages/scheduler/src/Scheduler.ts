import { NoPriority, PriorityLevel } from "./SchedulerPriorities"
import { getCurrentTime } from "@my-mini-react/shared/utils"

export * from "./SchedulerPriorities.js"

export type Task = {
    id: number
    callback: Callback | null
    priorityLevel: PriorityLevel
    startTime: number
    expirationTime: number
    sortIndex: number
}

type Callback = (arg: boolean) => Callback | null | undefined

const taskQueue: Array<Task> = []

let currentTask: Task | null = null
let currentPriorityLevel: PriorityLevel = NoPriority
let startTime = -1

//任务调度器的入口函数
export function scheduleCallback(priorityLevel: PriorityLevel, callback: Callback) {

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

export function shouldYieldToHost() {
    const timeElapsed = getCurrentTime() - startTime
}