function fn() {
    console.log("option 1");
}

function decorator() {
    return function () {
        console.log("option 2");
        fn()
    }

}

decorator()()

