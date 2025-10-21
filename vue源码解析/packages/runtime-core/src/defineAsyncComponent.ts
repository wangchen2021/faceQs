import { ref } from "@vue/reactivity"
import { h } from "./h"
import { isFunction } from "@vue/shared"

type AsyncComponentOptionsType = {
    loader: () => Promise<any>,
    timeout?: number,
    errorComponent?: any,
    loadingComponent?: any,
    delay?: number,
    onError?: (error: any, retry: () => void, fail: () => void, attempts: number) => void
}

export const defineAsyncComponent = (options: AsyncComponentOptionsType | (() => Promise<any>)) => {
    if (isFunction(options)) {
        options = {
            loader: options as () => Promise<any>
        }
    }
    return {
        setup() {
            const loaded = ref(false)
            const error = ref(null)
            const loading = ref(false)
            let loadingTimer: any = null
            let component: any = null
            const { loader, errorComponent, timeout, delay, loadingComponent, onError } = options

            let attempts = 0
            function loadFunc() {
                return loader().catch(err => {
                    if (onError) {
                        return new Promise((resolve, reject) => {
                            const retry = () => resolve(loadFunc())
                            const fail = () => reject(err)
                            onError(err, retry, fail, ++attempts)
                        })
                    } else {
                        throw err //将错误继续抛出
                    }
                })
            }

            loadFunc()
                .then((camp) => {
                    component = camp
                    loaded.value = true
                })
                .catch(err => {
                    error.value = err
                })
                .finally(() => {
                    loading.value = false
                    clearTimeout(loadingTimer)
                })


            if (delay) {
                loadingTimer = setTimeout(() => {
                    loading.value = true
                }, delay)
            }


            if (timeout) {
                setTimeout(() => {
                    if (!loaded.value) {
                        error.value = new Error("timeout")
                        throw new Error("组件加载加载失败");
                    }
                }, timeout)
            }

            return () => {
                if (loaded.value) {
                    return h(component)
                }
                else if (error.value && errorComponent) {
                    return h(errorComponent)
                }
                else if (loading.value && loadingComponent) {
                    return h(loadingComponent)
                }
                else {
                    return h("div")
                }
            }
        }
    }
}