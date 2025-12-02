const newAPI = () => {
    return "123"
}

const adapter = (...args) => {
    return Number(newAPI(...args))
}

const res = adapter()

console.log(res);
