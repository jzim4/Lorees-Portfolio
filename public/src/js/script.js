import {data, pics} from "../../helpers/js/initFirebase.js";

var dataList = Object.entries(data)

console.log(dataList.length);
console.log(dataList);
console.log(document.getElementById("citiesContainer"));

var myInitCode = function () {
    for (var i=0; i<dataList.length; i++) {
        document.getElementById("citiesContainer").innerHTML += "<div>" + dataList[i][1] + "</div>";
        console.log(i);
    }
    console.log(pics.photo1);
    document.getElementById("citiesContainer").innerHTML += "<img src=\"" + pics.photo1 + "\">";
}

if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        myInitCode();
    });
}
