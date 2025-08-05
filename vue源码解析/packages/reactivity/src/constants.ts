export enum ReactiveFlags {
    SKIP = '__v_skip',
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    RAW = '__v_raw'
}

export enum DirtyLevels {
    Dirty = 4, //执行运行计算属性
    NoDirty = 0, //不执行运行计算属性
}