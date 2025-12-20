import { describe, expect, it } from "vitest"
import { ImmediatePriority, NormalPriority, scheduleCallback, UserBlockingPriority } from "../src/Scheduler"

describe("scheduler", () => {
    it("four different tasks", () => {

        let eventTasks = []

        scheduleCallback(NormalPriority, () => {
            eventTasks.push("Task1")
            expect(eventTasks).toEqual(["Task3", "Task2", "Task1"])
            return null
        })

        scheduleCallback(UserBlockingPriority, () => {
            eventTasks.push("Task2")
            expect(eventTasks).toEqual(["Task3", "Task2"])
            return null
        })

        scheduleCallback(ImmediatePriority, () => {
            eventTasks.push("Task3")
            expect(eventTasks).toEqual(["Task3"])
            return null
        })

        scheduleCallback(NormalPriority, () => {
            eventTasks.push("Task4")
            expect(eventTasks).toEqual(["Task3", "Task2", "Task1", "Task4"])
            return null
        })
    })
})