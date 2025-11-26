
interface RequestParams {
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object
    headers?: { [key: string]: string }
}

interface setUpPramsReturn {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object
    headers?: { [key: string]: string }
}

function setUpPrams(params: RequestParams) {
    let { url, method, data } = params
    if (!method) {
        params.method = 'GET'
    }
    if (params.method === 'GET' && data) {
        url += "?"
        for (let key in data) {
            const value = data[key as keyof typeof data]
            url += `${key}=${value}&`
        }
        params.url = url.slice(0, -1)
        params.data = undefined
    }
}

function setHeaders(xhr: XMLHttpRequest, headers: { [key: string]: string }) {
    for (let key in headers) {
        xhr.setRequestHeader(key, headers[key])
    }
}

export function ajaxRequest(params: RequestParams) {
    const xhr = new XMLHttpRequest()
    setUpPrams(params)
    let { url, method, data, headers } = params as setUpPramsReturn
    xhr.open(method, url, true) //true表示异步请求
    if (headers) {
        setHeaders(xhr, headers)
    }
    xhr.send(data as any)
    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                const jsonResponse = JSON.parse(xhr.response)
                resolve(jsonResponse)
            } else {
                reject(new Error("请求失败，状态码为:" + xhr.status))
            }
        }
        xhr.onerror = function (err) {
            reject(new Error("网络请求失败:" + err))
        }
    })
}
