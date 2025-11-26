export interface RequestHeader {
    [key: string]: string
}

type RequestMethod = "GET" | "POST" | "DELETE" | "PUT"

export interface RequestConfig {
    url: string,
    method?: RequestMethod,
    headers?: RequestHeader
    data?: Record<string, any>
}

interface SetUpRequestConfig {
    url: string,
    method: RequestMethod,
    headers?: RequestHeader
    data?: Record<string, any>
}

function setUpConfig(config: RequestConfig) {
    if (!config.method) config.method = "GET"
    if (config.data != undefined && config.method === "GET") {
        config.url = config.url + "?"
        for (let key in config.data) {
            config.url = config.url + `${key}=${config.data[key]}&`
        }
        config.url = config.url.slice(0, -1)
        config.data = undefined
    }
}

export function request(config: RequestConfig) {
    setUpConfig(config)
    const xhr = new XMLHttpRequest()
    const { url, data, headers, method } = config as SetUpRequestConfig
    xhr.open(url, method, true)
    xhr.send(data as any)
    return new Promise((resolve, reject) => {
        if (headers) {
            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key])
            }
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const jsonResponse = JSON.parse(xhr.response)
                resolve(jsonResponse)
            } else {
                reject(xhr.status)
            }
        }
        xhr.onerror = (err) => {
            reject(err)
        }
    })
}


request({
    url: "12312",
    method: "GET",
    data: {
        a: 1,
        b: 2
    }
})
    .then((res) => {
        console.log(res);
    })

    .catch((err) => {
        console.error(err);
    })