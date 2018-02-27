function openNav() {
    document.getElementById("mySidenav").style.width = "50%";
    document.getElementById("main").style.marginRight = "50%";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display) {
            panel.style.display = null;
        } else {
            panel.style.display = "block";
        }
    });
}
