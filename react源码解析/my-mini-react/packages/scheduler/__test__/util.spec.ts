import { isArray } from "@my-mini-react/shared"
import { describe, test, expect, it } from "vitest"
import { Heap, Node, peek, push } from "../src/SchedulerMinHeap.js"

let idCounter = 0

function createNode(val: number): Node {
    return { id: idCounter++, sortIndex: val }
}

describe("util", () => {
    test("isArray", () => {
        expect(isArray([1, 2, 3])).toBe(true)
        expect(isArray({ a: 1 })).toBe(false)
        // expect(isArray(123)).toBe(true)
    })
})


describe("minHeap", () => {
    it("empty heap return null", () => {
        const tasks: Heap<Node> = []
        expect(peek(tasks)).toBe(null)
    })

    it("heap length>1", () => {
        const firstNode = createNode(1)
        const tasks: Heap<Node> = [firstNode]
        push(tasks, createNode(2))
        push(tasks, createNode(3))
        expect(peek(tasks)).toEqual(firstNode)
    })
})