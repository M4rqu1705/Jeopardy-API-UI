/* ============================ */
/* ====== Menu Animation ====== */
/* ============================ */
body = document.getElementsByTagName("body")[0];
aside = document.getElementsByTagName("aside")[0];
closeMenuButton = document.getElementById("close-menu");

var originalAsideWidth = aside.offsetWidth;

aside.addEventListener("mousedown", function (e){
    body.style.gridTemplateColumns = "auto 500px";
    // aside.style.width = "500px";
    aside.style.right = '0px';
});

closeMenuButton.addEventListener("click", function (e){
    body.style.gridTemplateColumns = "auto 100px";
    // aside.style.width = originalAsideWidth + "px";
    aside.style.right = '-400px';
    console.log("Retracting");
});
