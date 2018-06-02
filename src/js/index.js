import "../css/a.css"
import "../less/test.less"
// import "./sass/test.scss"


import {a, b, Person} from "./test.js"
console.log(a);
console.log(b);
$("div").eq(0).css({
	width:"800px",
	height: "800px",
	background: "#ccc"
});
document.querySelector("div").innerHTML = "after bundle123456";