import axios, { type AxiosRequestConfig, type Method } from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
})

export const httpAction = <T>(url: string, method: Method, data?: object, config?: AxiosRequestConfig): Promise<T> => {
    return new Promise((resolve, reject) => {
        axiosInstance({
            url,
            data,
            method,
            ...config
        })
            .then(res => {
                resolve(res.data as T)
            })
            .catch(err => {
                console.error(err);
                reject(err)
            })
    })
}

export const getAction = <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return httpAction<T>(url, "GET", undefined, { ...config, params: data })
}

export const postAction = <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return httpAction<T>(url, "POST", data, config)
}

export const putAction = <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return httpAction<T>(url, "PUT", data, config)
}