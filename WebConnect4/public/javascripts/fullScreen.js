
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
    let elements = document.getElementsByClassName("fullscreen-btn");
    elements[0].innerHTML = "Close Fullscreen";
    elements[0].onclick = closeFullscreen;
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    let elements = document.getElementsByClassName("fullscreen-btn");
    elements[0].innerHTML = "Open Fullscreen";
    elements[0].onclick = openFullscreen;

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
        }
}