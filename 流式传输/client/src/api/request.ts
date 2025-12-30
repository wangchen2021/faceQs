import axios, { type AxiosRequestConfig, type Method } from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
})

export const httpAction = (url: string, method: Method, data?: object, config?: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
        axiosInstance({
            url,
            data,
            method,
            ...config
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                console.error(err);
                reject(err)
            })
    })
}

export const getAction = (url: string, data?: object, config?: AxiosRequestConfig) => {
    return httpAction(url, "GET", undefined, { ...config, params: data })
}

export const postAction = (url: string, data?: object, config?: AxiosRequestConfig) => {
    return httpAction(url, "POST", data, config)
}

export const putAction = (url: string, data?: object, config?: AxiosRequestConfig) => {
    return httpAction(url, "PUT", data, config)
}