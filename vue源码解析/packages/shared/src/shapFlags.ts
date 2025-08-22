export enum ShapeFlags {
    ELEMENT = 1, // 1 << 0
    FUNCTIONAL_COMPONENT = 1 << 1, // 1 << 1
    STATEFUL_COMPONENT = 1 << 2, // 1 << 2
    TEXT_CHILDREN = 1 << 3, // 1 << 3
    ARRAY_CHILDREN = 1 << 4, // 1 << 4
    SLOTS_CHILDREN = 1 << 5, // 1 << 5
    TELEPORT = 1 << 6, // 1 << 6
    SUSPENSE = 1 << 7, // 1 << 7
}