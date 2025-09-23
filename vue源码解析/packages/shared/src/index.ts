export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object'
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isString(val: unknown): val is string {
  return typeof val === 'string' || val instanceof String // 兼容String对象
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn(val: object, key: string | symbol): boolean {
  return hasOwnProperty.call(val, key)
}

export * from './shapFlags'