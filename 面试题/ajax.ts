
interface RequestParams {
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
    headers?: { [key: string]: string }
}

interface setUpPramsReturn {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
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
            const value = data[key]
            url += `${key}=${value}&`
        }
        params.url = url.slice(0, -1)
        data = null
    }
}

function setHeadrs(xhr: XMLHttpRequest, headers: { [key: string]: string }) {
    for (let key in headers) {
        xhr.setRequestHeader(key, headers[key])
    }
}

function request(params: RequestParams) {
    const xhr = new XMLHttpRequest()
    setUpPrams(params)
    let { url, method, data, headers } = params as setUpPramsReturn
    xhr.open(url, method, true) //true表示异步请求
    if (headers) {
        setHeadrs(xhr, headers)
    }
    xhr.send(data)
    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response)
            } else {
                reject(new Error("请求失败，状态码为:" + xhr.status))
            }
        }
        xhr.onerror = function (err) {
            reject(new Error("网络请求失败:" + err))
        }
    })
}
