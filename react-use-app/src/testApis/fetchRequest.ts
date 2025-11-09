
interface RequestParams {
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
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

export function fechRequest(param: RequestParams) {
    setUpPrams(param)
    return new Promise((resolve, reject) => {
        fetch(param.url, {
            method: param.method,
            headers: param.headers,
            body: param.data ? JSON.stringify(param.data) : undefined
        })
            .then(response => {
                if (!response.ok) {
                    reject("请求失败，状态码为:" + response.status)
                }
                resolve(response.json())
            })
            .catch(error => {
                reject(error)
            })
    })

}

fechRequest.get = function (param: RequestParams) {
    return fechRequest({ ...param, method: 'GET' })
}
