function request(url: string, method: string, data: any) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(url, method, true)
        xhr.send(data)
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }
        xhr.onerror = function (err) {
            reject(err)
        }
    })
}