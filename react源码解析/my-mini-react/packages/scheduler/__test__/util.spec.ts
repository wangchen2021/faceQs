import { isArray } from "shared/utils"
import { describe, test, expect } from "vitest"

describe("scheduler", () => {
    test("isArray", () => {
        expect(isArray([1, 2, 3])).toBe(true)
        expect(isArray({ a: 1 })).toBe(false)
        // expect(isArray(123)).toBe(true)
    })
})