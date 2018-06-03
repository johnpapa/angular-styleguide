// import "./sass/test.scss"
import "./css/a.css";
import "./less/test.less";

import {a, b} from "./js/test";

console.log(a);
console.log(b);
document.querySelector("div").innerHTML = "after bundle1";
$("div").eq(1).css({ width: "400px", heihgt: "400px"});
