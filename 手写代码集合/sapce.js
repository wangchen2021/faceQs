"use strict"
var a = 1;
function fn(){
    var a = 2;
    function a(){console.log(3);}
    return a;
    function a(){console.log(4);}
}
var b = fn();
console.log(b)