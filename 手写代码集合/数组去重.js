
Array.prototype.unique = function () {
    return Array.from(new Set(this))
}

console.log([1, 2, 3, 4, 5, 5, 6, 6, 1].unique());
