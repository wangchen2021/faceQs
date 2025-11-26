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
    const { url, method, data, headers } = config as SetUpRequestConfig
    return new Promise((resolve, reject) => {
        fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined
        })
            .then((res) => {
                if (!res.ok) {
                    reject(res.status)
                } else {
                    resolve(res.json())
                }
            })
            .catch((err) => {
                reject(err)
            })
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