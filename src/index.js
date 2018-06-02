import "./css/a.css"
import "./less/test.less"
// import "./sass/test.scss"


import {a, b, Person} from "./js/test.js"
console.log(a);
console.log(b);
document.querySelector("div").innerHTML = "after bundle1";
$("div").eq(1).css({
	"width": "400px",
	"heihgt": "400px"
})