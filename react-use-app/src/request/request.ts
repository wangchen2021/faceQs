import { instance } from "./instance";

interface RequestParams {
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object
    headers?: { [key: string]: string }
}

const getAction = (params: RequestParams) => {
    return instance.get(params.url, {
        data: params.data,
        headers: params.headers
    })
}

const postAction = (params: RequestParams) => {
    return instance.post(params.url, params.data, {
        headers: params.headers
    })
}

const putAction = (params: RequestParams) => {
    return instance.put(params.url, params.data, {
        headers: params.headers
    })
}

const deleteAction = (params: RequestParams) => {
    return instance.delete(params.url, {
        data: params.data,
        headers: params.headers
    })
}

const httpRequest = (params: RequestParams) => {
    return instance({
        url: params.url,
        method: params.method,
        data: params.data,
        headers: params.headers
    })
}

export { getAction, postAction, putAction, deleteAction, httpRequest }